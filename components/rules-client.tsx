"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Rule = {
  id: string;
  name: string;
  enabled: boolean;
  tagType: string;
  tagValue: string;
  matchType: string;
  pattern: string;
  source: string;
};

export function RulesClient({
  rules,
  terms,
}: {
  rules: Rule[];
  terms: { id: string; tagType: string; label: string }[];
}) {
  const router = useRouter();
  const [list, setList] = useState(rules);
  const [name, setName] = useState("");
  const [pattern, setPattern] = useState("");
  const [tagType, setTagType] = useState("Category");
  const [tagValue, setTagValue] = useState("Shipping");
  const [matchType, setMatchType] = useState("keyword");

  async function toggle(rule: Rule, enabled: boolean) {
    setList((rows) => rows.map((r) => (r.id === rule.id ? { ...r, enabled } : r)));
    await fetch(`/api/rules/${rule.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    });
    router.refresh();
  }

  async function addRule(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pattern, tagType, tagValue, matchType }),
    });
    if (res.ok) {
      setName("");
      setPattern("");
      router.refresh();
      const created = (await res.json()) as Rule;
      setList((rows) => [...rows, created]);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Rules</h1>
        <p className="mt-1 text-sm text-slate-600">
          Optional. The demo already tags shipping, billing, returns, and the
          three brands. Change these after you have seen one message tagged.
        </p>
      </div>

      <Card>
        <CardBody className="space-y-3">
          <p className="text-sm font-medium">Golden list we tag against</p>
          <p className="text-sm text-slate-600">
            {terms.map((t) => t.label).join(" · ") || "None yet."}
          </p>
        </CardBody>
      </Card>

      <div className="space-y-2">
        {list.map((rule) => (
          <Card key={rule.id}>
            <CardBody className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{rule.name}</p>
                <p className="text-sm text-slate-500">
                  If {rule.matchType} matches “{rule.pattern}”, set {rule.tagType} to{" "}
                  {rule.tagValue}
                  {rule.source === "feedback" ? " · learned from a change" : ""}
                </p>
              </div>
              <Switch
                checked={rule.enabled}
                onCheckedChange={(v) => void toggle(rule, v)}
              />
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody>
          <form onSubmit={(e) => void addRule(e)} className="space-y-3">
            <p className="font-medium">Add a simple rule</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label>Words or hashtag</Label>
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="late, delayed"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Which tag</Label>
                <Input value={tagType} onChange={(e) => setTagType(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Value</Label>
                <Input value={tagValue} onChange={(e) => setTagValue(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Match</Label>
                <Input value={matchType} onChange={(e) => setMatchType(e.target.value)} />
              </div>
            </div>
            <Button type="submit">Add rule</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
