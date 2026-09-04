import { extractHashtags } from "@/lib/utils";
import type { MessageInput, RuleInput, TagSuggestion } from "@/lib/classify/types";

export function matchRule(
  rule: RuleInput,
  message: MessageInput,
): TagSuggestion | null {
  if (!rule.enabled) return null;
  const haystack = rule.caseSensitive
    ? `${message.text} ${message.account} ${message.author} ${message.channel}`
    : `${message.text} ${message.account} ${message.author} ${message.channel}`.toLowerCase();
  const pattern = rule.caseSensitive ? rule.pattern : rule.pattern.toLowerCase();

  switch (rule.matchType) {
    case "hashtag": {
      const tags = extractHashtags(message.text);
      const needle = pattern.startsWith("#") ? pattern : `#${pattern}`;
      if (tags.includes(needle.toLowerCase())) {
        return { value: rule.tagValue, confidence: 0.94, source: "rules" };
      }
      return null;
    }
    case "account": {
      const account = message.account.toLowerCase();
      if (account === pattern || account.includes(pattern)) {
        return { value: rule.tagValue, confidence: 0.91, source: "rules" };
      }
      return null;
    }
    case "regex": {
      try {
        const flags = rule.caseSensitive ? "" : "i";
        if (new RegExp(rule.pattern, flags).test(message.text)) {
          return { value: rule.tagValue, confidence: 0.9, source: "rules" };
        }
      } catch {
        return null;
      }
      return null;
    }
    case "keyword":
    default: {
      const parts = pattern
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      const hits = parts.filter((p) => haystack.includes(p));
      if (hits.length === 0) return null;
      const confidence = Math.min(0.96, 0.84 + hits.length * 0.04);
      return { value: rule.tagValue, confidence, source: "rules" };
    }
  }
}

export function applyRules(
  tagType: string,
  rules: RuleInput[],
  message: MessageInput,
): TagSuggestion | null {
  const ranked = rules
    .filter((r) => r.tagType === tagType && r.enabled)
    .sort((a, b) => a.priority - b.priority);
  for (const rule of ranked) {
    const hit = matchRule(rule, message);
    if (hit) return hit;
  }
  return null;
}
