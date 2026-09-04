import type { ReactNode } from "react";
import Link from "next/link";
import { LogoWordmark } from "@/components/logo";
import { LogoutButton } from "@/components/logout-button";
import { MobileNav, SideNav } from "@/components/nav-links";

export function AppShell({
  children,
  email,
  queueCount,
}: {
  children: ReactNode;
  email: string;
  queueCount: number;
}) {
  return (
    <div className="min-h-screen bg-[#f3f6f9]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col bg-[#0b1220] text-white lg:flex">
        <div className="flex h-14 items-center border-b border-white/10 px-4">
          <Link href="/app">
            <LogoWordmark light />
          </Link>
        </div>
        <SideNav queueCount={queueCount} />
        <div className="border-t border-white/10 px-4 py-3 text-xs text-slate-400">
          <p className="text-slate-300">{email}</p>
          <p className="mt-1">Demo workspace</p>
        </div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4">
          <div className="flex items-center gap-3 lg:hidden">
            <LogoWordmark />
          </div>
          <p className="hidden text-sm text-slate-500 lg:block">
            Connect → work happens → you only step in when asked
          </p>
          <div className="flex items-center gap-2">
            <MobileNav queueCount={queueCount} />
            <LogoutButton />
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      </div>
    </div>
  );
}
