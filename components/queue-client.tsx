"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoLockup } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Item = {
  id: string;
  text: string;
  author: string;
  channel: string;
  category: string | null;
  brand: string | null;
  campaign: string | null;
};

export function QueueClient({ items }: { items: Item[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState({ category: "", brand: "", campaign: "" });
  const current = items;

  if (current.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Needs review</h1>
        <Card>
          <CardBody className="py-10 text-center">
            <div className="mb-4 flex justify-center">
              <LogoLockup width={96} />
            </div>
            <p className="text-lg font-medium">Nothing needs you.</p>
            <p className="mt-2 text-sm text-slate-600">
              Go to Home and press “Show me a tagged message.” If we are unsure,
              it will land here.
            </p>
            <Button asChild className="mt-5" size="lg">
              <Link href="/app">Back to Home</Link>
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Needs review</h1>
        <p className="mt-1 text-sm text-slate-600">
          Keep our guess or change it. That is the only choice.
        </p>
      </div>
      {current.map((item) => {
        const sentence = weTaggedSentence(item);
        const isEditing = editing === item.id;
        return (
          <Card key={item.id}>
            <CardBody className="space-y-4">
              <p className="text-base leading-7 text-[#0b1220]">“{item.text}”</p>
              <p className="text-sm text-slate-500">
                {item.author} · {item.channel}
              </p>
              <p className="text-lg font-semibold text-[#0b1220]">{sentence}</p>
              {isEditing ? (
                <div className="space-y-3 rounded-lg bg-slate-50 p-3">
                  <form action={`/api/review/${item.id}`} method="POST" className="space-y-3">
                    <input type="hidden" name="decision" value="edited" />
                    <Field
                      label="Category"
                      name="category"
                      value={draft.category}
                      onChange={(v) => setDraft((d) => ({ ...d, category: v }))}
                    />
                    <Field
                      label="Brand"
                      name="brand"
                      value={draft.brand}
                      onChange={(v) => setDraft((d) => ({ ...d, brand: v }))}
                    />
                    <Field
                      label="Campaign"
                      name="campaign"
                      value={draft.campaign}
                      onChange={(v) => setDraft((d) => ({ ...d, campaign: v }))}
                    />
                    <div className="flex gap-2">
                    <Button type="submit">Save change</Button>
                      <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <form action={`/api/review/${item.id}`} method="POST">
                    <input type="hidden" name="decision" value="approved" />
                    <Button type="submit" size="lg" variant="green">
                      Keep
                    </Button>
                  </form>
                  <Button
                    type="button"
                    size="lg"
                    variant="orange"
                    onClick={() => {
                      setEditing(item.id);
                      setDraft({
                        category: item.category ?? "",
                        brand: item.brand ?? "",
                        campaign: item.campaign ?? "",
                      });
                    }}
                  >
                    Change
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function weTaggedSentence(item: Item) {
  const bits = [
    item.category ? `Category ${item.category}` : null,
    item.brand ? `Brand ${item.brand}` : null,
    item.campaign ? `Campaign ${item.campaign}` : null,
  ].filter(Boolean);
  if (bits.length === 0) {
    return "We were not sure what to tag this as.";
  }
  if (bits.length === 1) return `We tagged this as ${bits[0]}.`;
  if (bits.length === 2) return `We tagged this as ${bits[0]} and ${bits[1]}.`;
  return `We tagged this as ${bits[0]}, ${bits[1]}, and ${bits[2]}.`;
}
