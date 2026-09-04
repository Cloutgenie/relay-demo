import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPct(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${Math.round(value * 100)}%`;
}

export function formatWhen(value: Date | string) {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[#@]/g, " ")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);
}

export function extractHashtags(text: string) {
  return (text.match(/#[\w-]+/g) ?? []).map((h) => h.toLowerCase());
}
