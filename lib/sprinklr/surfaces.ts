export type SurfaceStatus = "in_use" | "stubbed" | "legacy" | "out_of_scope";

export type SprinklrSurface = {
  id: string;
  title: string;
  does: string;
  href: string;
  status: SurfaceStatus;
  modules: string[];
};

/** Official Sprinklr developer surfaces Relay tracks. */
export const SPRINKLR_SURFACES: SprinklrSurface[] = [
  {
    id: "api2",
    title: "Current Sprinklr work APIs",
    does: "Messages, cases, profiles, tags, publishing, assets, and boards.",
    href: "https://dev.sprinklr.com/api2-0",
    status: "in_use",
    modules: ["autofill", "sidekick", "boards", "publish", "rights", "assign", "profiles", "access"],
  },
  {
    id: "api1",
    title: "Older Sprinklr work APIs",
    does: "The previous generation. Relay does not call these.",
    href: "https://dev.sprinklr.com/api1-0",
    status: "legacy",
    modules: [],
  },
  {
    id: "webhooks",
    title: "Live updates from Sprinklr",
    does: "Sprinklr pings Relay when a message, case, draft, profile, asset, or campaign changes.",
    href: "https://dev.sprinklr.com/sprinklr-webhooks",
    status: "in_use",
    modules: ["autofill", "webhooks", "sla", "rights", "profiles"],
  },
  {
    id: "sdks",
    title: "Sprinklr app kits",
    does: "Kits for embedding Sprinklr in other apps. Relay uses a case-page panel instead.",
    href: "https://dev.sprinklr.com/sdks",
    status: "out_of_scope",
    modules: ["sidekick"],
  },
  {
    id: "community",
    title: "Community / forums",
    does: "Reads and writes Sprinklr community posts. Not in this console yet.",
    href: "https://dev.sprinklr.com/community-apis",
    status: "stubbed",
    modules: [],
  },
  {
    id: "livechat",
    title: "Website chat",
    does: "Live chat on a brand site. Not in this console yet.",
    href: "https://dev.sprinklr.com/live-chat-application-apis",
    status: "stubbed",
    modules: ["sidekick"],
  },
  {
    id: "blueprints",
    title: "Ready-made recipes",
    does: "Sprinklr’s integration recipes. Connect follows the same idea in plain English.",
    href: "https://dev.sprinklr.com/integration-blueprints",
    status: "in_use",
    modules: ["connect"],
  },
  {
    id: "postman",
    title: "Tester pack",
    does: "Sprinklr’s Postman collection for live checks. Demo does not need it.",
    href: "https://dev.sprinklr.com/sprinklr-postman-collection",
    status: "out_of_scope",
    modules: ["connect"],
  },
];

export const WEBHOOK_EVENTS = [
  { type: "Message received", when: "2 minutes ago", family: "Message" },
  { type: "Message updated", when: "1 hour ago", family: "Message" },
  { type: "Publish failed", when: "40 minutes ago", family: "Message" },
  { type: "Case created", when: "18 minutes ago", family: "Case" },
  { type: "Case updated", when: "12 minutes ago", family: "Case" },
  { type: "Draft created", when: "3 hours ago", family: "Draft" },
  { type: "Profile updated", when: "yesterday", family: "Profile" },
  { type: "Asset updated", when: "2 days ago", family: "SAM" },
  { type: "Campaign updated", when: "this week", family: "Campaign" },
] as const;

export const SURFACE_LABEL: Record<SurfaceStatus, string> = {
  in_use: "Relay uses this",
  stubbed: "Mapped — not turned on yet",
  legacy: "Older — we skip it",
  out_of_scope: "Not this console",
};
