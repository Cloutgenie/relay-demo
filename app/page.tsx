import Link from "next/link";
import { LogoLockup, LogoWordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#0b1220]">
      <header className="border-b border-white/10 bg-[#0b1220]">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" aria-label="Relay home">
            <LogoWordmark light />
          </Link>
          <Button asChild size="sm">
            <Link href="/login">Try the demo</Link>
          </Button>
        </div>
      </header>

      <section className="bg-[#0b1220] text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <div className="mb-8 inline-flex rounded-2xl bg-white px-4 py-3">
            <LogoLockup width={140} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00bae9]">
            Sprinklr console
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            One place to do the Sprinklr work — without the API jargon.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Connect a workspace. Relay tags messages, sits on the case, stamps
            boards, and watches the rest. You only step in when something needs
            a person.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <Link href="/login">See it work</Link>
            </Button>
            <p className="mt-3 text-sm text-slate-400">
              Demo workspace. No Sprinklr login needed.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-xl font-semibold">What you can do</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "Fill Category, Brand, and Campaign on incoming messages",
            "See order, SKU, and CRM on the care case",
            "Stamp a golden board for a brand and market",
            "Export a client pack, find experiences, check drafts",
            "Watch rights, SLAs, assignment, and access",
            "Listening stays off until Sprinklr Support enables it",
          ].map((line) => (
            <li key={line} className="rounded-xl border border-slate-200 bg-[#f8fafc] px-4 py-3 text-sm leading-6 text-slate-700">
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/login">Open the demo</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
