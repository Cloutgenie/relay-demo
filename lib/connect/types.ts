import type { ModuleId } from "@/lib/modules/catalog";

export type CapabilityStatus = "ready" | "needs_setup" | "needs_support";

export type CapabilityRow = {
  moduleId: ModuleId;
  status: CapabilityStatus;
  why: string;
};

export type InstanceAccount = {
  name: string;
  handle: string;
};

export type InstanceField = {
  name: string;
  on: string;
  present: boolean;
};

export type InstanceReview = {
  workspace: string;
  environment: string;
  environmentLabel: string;
  signedInAs: string;
  role: string;
  accounts: InstanceAccount[];
  roles: string[];
  fields: InstanceField[];
  listeningEnabled: boolean;
  sprinklrFeatures: { name: string; on: boolean; note?: string }[];
  capabilities: CapabilityRow[];
};

export const CAPABILITY_LABEL: Record<CapabilityStatus, string> = {
  ready: "Ready",
  needs_setup: "Needs setup",
  needs_support: "Needs Sprinklr Support",
};
