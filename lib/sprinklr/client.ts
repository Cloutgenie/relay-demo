import type {
  CustomFieldWrite,
  FieldCheckResult,
  TagType,
} from "@/lib/sprinklr/types";

const TAG_TYPES: TagType[] = ["Category", "Brand", "Campaign"];
const ENTITY_TYPES = ["Message", "Case", "Profile"] as const;

export type SprinklrMode = "mock" | "live";

export function sprinklrMode(): SprinklrMode {
  const mode = process.env.SPRINKLR_MODE;
  return mode === "live" ? "live" : "mock";
}

export function listeningEnabled() {
  return (
    process.env.LISTENING_API_ENABLED === "true" ||
    process.env.LISTENING_API_ENABLED === "1"
  );
}

function baseUrl() {
  return process.env.SPRINKLR_BASE_URL ?? "https://api2.sprinklr.com";
}

function headers() {
  const key = process.env.SPRINKLR_API_KEY;
  return {
    "Content-Type": "application/json",
    ...(key ? { Authorization: `Bearer ${key}` } : {}),
  };
}

/**
 * Sprinklr Partner / Care API stubs.
 * Live calls only fire when SPRINKLR_MODE=live and credentials exist.
 * Mock mode returns deterministic successes so the product can be demoed.
 */
export class SprinklrClient {
  constructor(private mode: SprinklrMode = sprinklrMode()) {}

  async checkCustomFields(): Promise<FieldCheckResult[]> {
    if (this.mode === "mock") {
      return ENTITY_TYPES.flatMap((entityType) =>
        TAG_TYPES.map((tagType) => ({
          tagType,
          entityType,
          fieldName: tagType,
          exists: true,
          sprinklrFieldId: `mock_${entityType}_${tagType}`.toLowerCase(),
        })),
      );
    }

    const url = `${baseUrl()}/api/v2/custom-fields`;
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) {
      throw new Error(`Sprinklr custom-fields list failed (${res.status})`);
    }
    const body = (await res.json()) as {
      data?: { name?: string; id?: string; entityType?: string }[];
    };
    const rows = body.data ?? [];
    return ENTITY_TYPES.flatMap((entityType) =>
      TAG_TYPES.map((tagType) => {
        const hit = rows.find(
          (r) =>
            r.name?.toLowerCase() === tagType.toLowerCase() &&
            (r.entityType ?? entityType) === entityType,
        );
        return {
          tagType,
          entityType,
          fieldName: tagType,
          exists: Boolean(hit),
          sprinklrFieldId: hit?.id,
        };
      }),
    );
  }

  async createCustomField(
    tagType: TagType,
    entityType: (typeof ENTITY_TYPES)[number],
  ): Promise<{ id: string }> {
    if (this.mode === "mock") {
      return { id: `mock_${entityType}_${tagType}`.toLowerCase() };
    }

    const url = `${baseUrl()}/api/v2/custom-fields`;
    const res = await fetch(url, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        name: tagType,
        entityType,
        type: "PICKLIST",
        description: `Relay ${tagType} writeback`,
      }),
    });
    if (!res.ok) {
      throw new Error(`Sprinklr custom-field create failed (${res.status})`);
    }
    const body = (await res.json()) as { data?: { id?: string } };
    return { id: body.data?.id ?? `created_${tagType}` };
  }

  async writeCustomProperties(write: CustomFieldWrite): Promise<{
    ok: boolean;
    mocked: boolean;
    requestId: string;
  }> {
    const requestId = `tt_${Date.now()}_${write.entityId}`;
    if (this.mode === "mock") {
      return { ok: true, mocked: true, requestId };
    }

    const url = `${baseUrl()}/api/v2/custom-properties`;
    const res = await fetch(url, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        entityType: write.entityType,
        entityId: write.entityId,
        properties: write.properties,
      }),
    });
    if (!res.ok) {
      throw new Error(`Sprinklr custom-properties write failed (${res.status})`);
    }
    return { ok: true, mocked: false, requestId };
  }

  /**
   * Listening firehose. Requires Sprinklr Support enablement.
   * Stubbed: never called unless LISTENING_API_ENABLED=true.
   */
  async pullListeningSample(): Promise<{ enabled: boolean; items: unknown[] }> {
    if (!listeningEnabled()) {
      return { enabled: false, items: [] };
    }
    if (this.mode === "mock") {
      return { enabled: true, items: [] };
    }
    const url = `${baseUrl()}/api/v2/listening/mentions`;
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) {
      throw new Error(`Sprinklr Listening API failed (${res.status})`);
    }
    const body = (await res.json()) as { data?: unknown[] };
    return { enabled: true, items: body.data ?? [] };
  }

  oauthAuthorizeUrl(state: string) {
    const clientId = process.env.SPRINKLR_CLIENT_ID ?? "";
    const redirect = process.env.SPRINKLR_REDIRECT_URI ?? "";
    const authorize =
      process.env.SPRINKLR_OAUTH_AUTHORIZE_URL ??
      "https://prod0-login.sprinklr.com/oauth/authorize";
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirect,
      response_type: "code",
      state,
    });
    return `${authorize}?${params.toString()}`;
  }
}

export const sprinklr = new SprinklrClient();
