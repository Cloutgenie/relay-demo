import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { applyHumanDecision } from "@/lib/pipeline";

function isForm(req: Request) {
  const ct = req.headers.get("content-type") ?? "";
  return (
    ct.includes("application/x-www-form-urlencoded") ||
    ct.includes("multipart/form-data")
  );
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  const form = isForm(req);
  if (!session) {
    if (form) return NextResponse.redirect(new URL("/login", req.url), 303);
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const { id } = await params;

  let decision: "approved" | "edited" | "rejected" | undefined;
  let category: string | undefined;
  let brand: string | undefined;
  let campaign: string | undefined;
  let note: string | undefined;

  if (form) {
    const data = await req.formData();
    decision = String(data.get("decision") ?? "") as typeof decision;
    category = String(data.get("category") ?? "") || undefined;
    brand = String(data.get("brand") ?? "") || undefined;
    campaign = String(data.get("campaign") ?? "") || undefined;
    note = String(data.get("note") ?? "") || undefined;
  } else {
    const body = (await req.json().catch(() => ({}))) as {
      decision?: "approved" | "edited" | "rejected";
      category?: string;
      brand?: string;
      campaign?: string;
      note?: string;
    };
    decision = body.decision;
    category = body.category;
    brand = body.brand;
    campaign = body.campaign;
    note = body.note;
  }

  if (!decision || !["approved", "edited", "rejected"].includes(decision)) {
    if (form) return NextResponse.redirect(new URL("/app/queue?error=1", req.url), 303);
    return NextResponse.json({ error: "Need Keep or Change." }, { status: 400 });
  }

  try {
    await applyHumanDecision({
      tenantId: session.tenantId,
      reviewId: id,
      actor: session.email,
      decision,
      category,
      brand,
      campaign,
      note,
    });
  } catch {
    if (form) return NextResponse.redirect(new URL("/app/queue?error=1", req.url), 303);
    return NextResponse.json({ error: "Could not save that." }, { status: 400 });
  }

  if (form) {
    return NextResponse.redirect(new URL("/app/queue", req.url), 303);
  }
  return NextResponse.json({ ok: true });
}
