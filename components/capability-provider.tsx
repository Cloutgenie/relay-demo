"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CapabilityRow, InstanceReview } from "@/lib/connect/types";
import type { ModuleId } from "@/lib/modules/catalog";

const Ctx = createContext<InstanceReview | null>(null);

export function CapabilityProvider({
  review,
  children,
}: {
  review: InstanceReview | null;
  children: ReactNode;
}) {
  return <Ctx.Provider value={review}>{children}</Ctx.Provider>;
}

export function useCapability(moduleId: ModuleId): CapabilityRow | null {
  const review = useContext(Ctx);
  return review?.capabilities.find((c) => c.moduleId === moduleId) ?? null;
}

export function useInstanceReview() {
  return useContext(Ctx);
}
