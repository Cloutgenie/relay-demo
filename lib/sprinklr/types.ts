export type SprinklrEntityType = "Message" | "Case" | "Profile" | "AdvocacyPost";

export type TagType = "Category" | "Brand" | "Campaign";

export type InboundEventType =
  | "MESSAGE_RECEIVED"
  | "MESSAGE_UPDATED"
  | "CASE_CREATED";

export type InboundPayload = {
  type: InboundEventType;
  payload: {
    id: string;
    text: string;
    channel: string;
    account: string;
    author: string;
    entityType?: SprinklrEntityType;
    customFields?: Record<string, string>;
  };
};

export type CustomFieldWrite = {
  entityType: SprinklrEntityType;
  entityId: string;
  properties: Partial<Record<TagType, string>>;
};

export type FieldCheckResult = {
  tagType: TagType;
  entityType: Exclude<SprinklrEntityType, "AdvocacyPost">;
  fieldName: string;
  exists: boolean;
  sprinklrFieldId?: string;
};
