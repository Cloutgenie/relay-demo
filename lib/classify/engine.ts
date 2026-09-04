import { applyRules } from "@/lib/classify/rules";
import { heuristicClassify } from "@/lib/classify/heuristic";
import {
  TAG_TYPES,
  fieldFor,
  type Classification,
  type MessageInput,
  type RuleInput,
  type TagSuggestion,
  type TermInput,
} from "@/lib/classify/types";

export function classifyMessage(
  message: MessageInput,
  rules: RuleInput[],
  terms: TermInput[],
): Classification {
  const result: Classification = {};

  for (const tagType of TAG_TYPES) {
    const ruleHit = applyRules(tagType, rules, message);
    const mlHit = heuristicClassify(tagType, terms, message);
    const merged = mergeHits(ruleHit, mlHit);
    if (merged) {
      result[fieldFor(tagType)] = merged;
    }
  }

  return result;
}

function mergeHits(
  ruleHit: TagSuggestion | null,
  mlHit: TagSuggestion | null,
): TagSuggestion | undefined {
  if (ruleHit && mlHit && ruleHit.value === mlHit.value) {
    return {
      value: ruleHit.value,
      confidence: Math.min(0.99, ruleHit.confidence + 0.03),
      source: "mixed",
    };
  }
  if (ruleHit) return ruleHit;
  if (mlHit) return mlHit;
  return undefined;
}

export function overallSource(c: Classification) {
  const sources = [c.category, c.brand, c.campaign]
    .filter(Boolean)
    .map((s) => s!.source);
  if (sources.includes("human")) return "human";
  if (sources.includes("rules") && sources.includes("ml")) return "mixed";
  if (sources.includes("mixed")) return "mixed";
  if (sources.includes("rules")) return "rules";
  if (sources.includes("ml")) return "ml";
  return null;
}

export function minConfidence(c: Classification) {
  const vals = [c.category, c.brand, c.campaign]
    .filter(Boolean)
    .map((s) => s!.confidence);
  if (vals.length === 0) return 0;
  return Math.min(...vals);
}

export function shouldAutoWrite(
  c: Classification,
  autoWriteThreshold: number,
) {
  if (!c.category || c.category.confidence < autoWriteThreshold) return false;
  const tags = [c.category, c.brand, c.campaign].filter(Boolean);
  return tags.every((t) => t!.confidence >= autoWriteThreshold);
}

export function shouldQueue(c: Classification, reviewThreshold: number) {
  const tags = [c.category, c.brand, c.campaign].filter(Boolean);
  if (tags.length === 0) return true;
  return tags.some((t) => t!.confidence < 0.82) || minConfidence(c) < reviewThreshold;
}
