import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as {
    name?: string;
    pattern?: string;
    tagType?: string;
    tagValue?: string;
    matchType?: string;
  };
  if (!body.name || !body.pattern || !body.tagValue) {
    return NextResponse.json({ error: "Name, pattern, and value required." }, { status: 400 });
  }
  const rule = await prisma.rule.create({
    data: {
      tenantId: session.tenantId,
      name: body.name,
      pattern: body.pattern,
      tagType: body.tagType ?? "Category",
      tagValue: body.tagValue,
      matchType: body.matchType ?? "keyword",
      enabled: true,
      priority: 50,
      source: "manual",
    },
  });
  return NextResponse.json(rule);
}
