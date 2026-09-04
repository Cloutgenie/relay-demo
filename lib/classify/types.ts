import type { TagType } from "@/lib/sprinklr/types";

export type TagSuggestion = {
  value: string;
  confidence: number;
  source: "rules" | "ml" | "mixed" | "human";
};

export type Classification = {
  category?: TagSuggestion;
  brand?: TagSuggestion;
  campaign?: TagSuggestion;
};

export type RuleInput = {
  id: string;
  enabled: boolean;
  priority: number;
  tagType: string;
  tagValue: string;
  matchType: string;
  pattern: string;
  caseSensitive: boolean;
};

export type TermInput = {
  tagType: string;
  label: string;
  keywords: string[];
};

export type MessageInput = {
  text: string;
  channel: string;
  account: string;
  author: string;
};

export const TAG_TYPES: TagType[] = ["Category", "Brand", "Campaign"];

export function fieldFor(type: TagType): keyof Classification {
  if (type === "Category") return "category";
  if (type === "Brand") return "brand";
  return "campaign";
}
