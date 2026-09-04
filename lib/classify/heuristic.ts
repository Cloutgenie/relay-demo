import { tokenize } from "@/lib/utils";
import type { MessageInput, TagSuggestion, TermInput } from "@/lib/classify/types";

/**
 * Offline-friendly leftover classifier.
 * Scores taxonomy terms by token overlap (TF-style) plus account/author hints.
 * Not a trained model — good enough to route leftovers into review or autofill.
 */
export function heuristicClassify(
  tagType: string,
  terms: TermInput[],
  message: MessageInput,
): TagSuggestion | null {
  const pool = terms.filter((t) => t.tagType === tagType);
  if (pool.length === 0) return null;

  const tokens = tokenize(
    `${message.text} ${message.account} ${message.author}`,
  );
  if (tokens.length === 0) return null;

  const df = new Map<string, number>();
  for (const term of pool) {
    const vocab = new Set(tokenize(`${term.label} ${term.keywords.join(" ")}`));
    for (const w of vocab) df.set(w, (df.get(w) ?? 0) + 1);
  }

  const scores = pool.map((term) => {
    const vocab = tokenize(`${term.label} ${term.keywords.join(" ")}`);
    let score = 0;
    for (const token of tokens) {
      if (!vocab.includes(token)) continue;
      const idf = Math.log((pool.length + 1) / ((df.get(token) ?? 1) + 0.5));
      score += 1 + idf;
    }
    if (
      tagType === "Brand" &&
      message.account.toLowerCase().includes(term.label.toLowerCase().split(" ")[0] ?? "")
    ) {
      score += 1.4;
    }
    return { term, score };
  });

  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];
  const second = scores[1]?.score ?? 0;
  if (!top || top.score <= 0) return null;

  const margin = top.score / (top.score + second + 0.65);
  const confidence = Math.max(0.38, Math.min(0.86, margin));
  return { value: top.term.label, confidence, source: "ml" };
}
