"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoLockup } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Message = {
  id: string;
  text: string;
  author: string;
  channel: string;
  category: string | null;
  brand: string | null;
  campaign: string | null;
};

export function WidgetClient({ message }: { message: Message | null }) {
  const router = useRouter();
  const [category, setCategory] = useState(message?.category ?? "");
  const [brand, setBrand] = useState(message?.brand ?? "");
  const [campaign, setCampaign] = useState(message?.campaign ?? "");
  const [saved, setSaved] = useState(false);

  if (!message) {
    return (
      <div className="space-y-3">
        <LogoLockup width={96} />
        <h1 className="text-2xl font-semibold">Agent panel</h1>
        <p className="text-sm text-slate-600">
          This is the small panel an agent would see on a Sprinklr record.
          Tag a sample message on Home first.
        </p>
        <Button asChild>
          <Link href="/app">Go to Home</Link>
        </Button>
      </div>
    );
  }

  async function save() {
    if (!message) return;
    await fetch("/api/widget/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId: message.id,
        category,
        brand,
        campaign,
      }),
    });
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Agent panel</h1>
        <p className="mt-1 text-sm text-slate-600">
          What an agent sees on a Sprinklr record. Change a tag here and we
          remember it for next time.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between bg-[#0b1220] px-4 py-2 text-xs text-slate-300">
          <span>Sprinklr Service</span>
          <span>Relay</span>
        </div>
        <div className="bg-white p-4">
          <p className="text-sm leading-6 text-slate-800">“{message.text}”</p>
          <p className="mt-1 text-xs text-slate-500">
            {message.author} · {message.channel}
          </p>
          <div className="mt-4 space-y-2">
            <div className="space-y-1">
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Brand</Label>
              <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Campaign</Label>
              <Input value={campaign} onChange={(e) => setCampaign(e.target.value)} />
            </div>
          </div>
          <Button className="mt-4" onClick={() => void save()}>
            Save tags
          </Button>
          {saved ? (
            <p className="mt-2 text-sm text-[#3d7a2c]">Saved. We will use this next time.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
