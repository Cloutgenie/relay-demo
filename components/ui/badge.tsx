import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "slate",
  children,
}: {
  className?: string;
  tone?: "slate" | "teal" | "blue" | "green" | "orange" | "navy";
  children: ReactNode;
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    teal: "bg-[#e6f8fd] text-[#0a6f8a]",
    blue: "bg-[#e6f3fb] text-[#118acb]",
    green: "bg-[#eef8ea] text-[#3d7a2c]",
    orange: "bg-[#fff4e0] text-[#8a5a00]",
    navy: "bg-[#0b1220] text-white",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
