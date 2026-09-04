import type { InstanceReview } from "@/lib/connect/types";

/** Full sample workspace so Connect demos without OAuth. */
export function demoInstanceReview(environment = "prod0"): InstanceReview {
  return {
    workspace: "Northwind CX · Prod workspace",
    environment,
    environmentLabel:
      environment === "prod2"
        ? "Production 2"
        : environment === "qa4"
          ? "QA 4"
          : "Production 0",
    signedInAs: "Jordan Hale",
    role: "Workspace admin",
    accounts: [
      { name: "Acme Care", handle: "AcmeCare" },
      { name: "Harbor Official", handle: "HarborOfficial" },
      { name: "Northwind Home", handle: "NorthwindHome" },
    ],
    roles: ["Workspace admin", "Care manager", "Publish approver"],
    fields: [
      { name: "Category", on: "Messages", present: true },
      { name: "Brand", on: "Messages", present: true },
      { name: "Campaign", on: "Messages", present: true },
      { name: "Category", on: "Cases", present: true },
      { name: "Brand", on: "Cases", present: true },
      { name: "Campaign", on: "Cases", present: true },
      { name: "Category", on: "Profiles", present: true },
      { name: "Brand", on: "Profiles", present: true },
      { name: "Campaign", on: "Profiles", present: true },
    ],
    listeningEnabled: false,
    sprinklrFeatures: [
      { name: "Care cases", on: true },
      { name: "Publishing", on: true },
      { name: "Asset library", on: true, note: "Two files are missing usage dates" },
      { name: "Reporting boards", on: true },
      { name: "Customer records (CRM link)", on: false, note: "Not linked yet" },
      { name: "Listening", on: false, note: "Sprinklr Support must turn this on" },
    ],
    capabilities: [
      {
        moduleId: "connect",
        status: "ready",
        why: "This workspace is linked. Relay can only do what Jordan can already do.",
      },
      {
        moduleId: "autofill",
        status: "ready",
        why: "Category, Brand, and Campaign are on messages. Autofill can write tags.",
      },
      {
        moduleId: "sidekick",
        status: "ready",
        why: "Care cases are on. Sidekick can sit on the case page.",
      },
      {
        moduleId: "boards",
        status: "ready",
        why: "Reporting boards are on. You can stamp a golden board.",
      },
      {
        moduleId: "export",
        status: "ready",
        why: "Reporting is on. You can build a client pack.",
      },
      {
        moduleId: "experiences",
        status: "ready",
        why: "Boards are on. You can find them by name.",
      },
      {
        moduleId: "publish",
        status: "ready",
        why: "Publishing is on. Drafts can go through the checklist.",
      },
      {
        moduleId: "rights",
        status: "needs_setup",
        why: "The asset library is on, but two files still need usage dates.",
      },
      {
        moduleId: "sla",
        status: "ready",
        why: "Care cases are on. Aging and failed sends can be watched.",
      },
      {
        moduleId: "assign",
        status: "ready",
        why: "Profiles and cases are readable. Work can be routed.",
      },
      {
        moduleId: "profiles",
        status: "needs_setup",
        why: "Customer records are not linked yet. The sample still shows how it looks.",
      },
      {
        moduleId: "access",
        status: "ready",
        why: "Roles and accounts came back with this sign-in.",
      },
      {
        moduleId: "webhooks",
        status: "ready",
        why: "The inbox can send Relay a copy of what happens.",
      },
      {
        moduleId: "listening",
        status: "needs_support",
        why: "Listening is off until Sprinklr Support enables it for this workspace.",
      },
    ],
  };
}
