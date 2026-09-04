"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ error }: { error?: string | null }) {
  const [showManual, setShowManual] = useState(false);
  const message =
    error === "auth"
      ? "Could not sign in. Try the demo button."
      : error === "missing"
        ? "Email and password required."
        : error
          ? "Could not sign in."
          : null;

  return (
    <div className="space-y-4">
      <form action="/api/auth/login" method="POST">
        <input type="hidden" name="email" value="admin@relay.demo" />
        <input type="hidden" name="password" value="demo" />
        <Button type="submit" size="lg" className="h-14 w-full text-base font-semibold">
          Open the demo workspace
        </Button>
      </form>
      <p className="text-center text-sm text-slate-400">
        Already connected. You will see tags appear on a sample message.
      </p>
      {message ? <p className="text-sm text-[#faa21b]">{message}</p> : null}
      <button
        type="button"
        className="w-full text-center text-xs text-slate-500 underline"
        onClick={() => setShowManual((v) => !v)}
      >
        {showManual ? "Hide email sign-in" : "Sign in with email"}
      </button>
      {showManual ? (
        <form action="/api/auth/login" method="POST" className="space-y-3 border-t border-white/10 pt-4">
          <div className="space-y-1.5">
            <Label className="text-slate-200">Email</Label>
            <Input
              type="email"
              name="email"
              defaultValue="admin@relay.demo"
              className="border-white/10 bg-[#0b1220] text-white"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-slate-200">Password</Label>
            <Input
              type="password"
              name="password"
              defaultValue="demo"
              className="border-white/10 bg-[#0b1220] text-white"
              required
            />
          </div>
          <Button type="submit" variant="outline" className="w-full border-white/20 bg-transparent text-white">
            Sign in
          </Button>
        </form>
      ) : null}
    </div>
  );
}
