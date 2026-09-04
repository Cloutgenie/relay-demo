export type AppStatus = "not_ready" | "working" | "watching" | "needs_review" | "done";

export function deriveStatus(input: {
  fieldsReady: boolean;
  pendingReviews: number;
  lastStatus?: string | null;
  working?: boolean;
}): AppStatus {
  if (input.working) return "working";
  if (!input.fieldsReady) return "not_ready";
  if (input.pendingReviews > 0) return "needs_review";
  if (input.lastStatus === "written") return "done";
  return "watching";
}

export const STATUS_COPY: Record<
  AppStatus,
  { label: string; title: string; detail: string; tone: "teal" | "orange" | "green" | "navy" | "slate" }
> = {
  not_ready: {
    label: "Not ready",
    title: "Connect a workspace first",
    detail: "Demo is one click. A live Sprinklr tenant uses the same screen.",
    tone: "slate",
  },
  working: {
    label: "Working",
    title: "Working — tagging this message",
    detail: "Reading the text, applying rules, then filling Category, Brand, and Campaign.",
    tone: "teal",
  },
  watching: {
    label: "Watching",
    title: "Watching — new messages get tags on their own",
    detail: "Nothing needs you right now. Send a sample if you want to see it happen.",
    tone: "navy",
  },
  needs_review: {
    label: "Needs review",
    title: "Needs review — we tagged something and want a check",
    detail: "Keep our guess or change it. That is the only decision.",
    tone: "orange",
  },
  done: {
    label: "Done",
    title: "Done — tags are on the message",
    detail: "Category, Brand, and Campaign were written back (demo simulates Sprinklr).",
    tone: "green",
  },
};
