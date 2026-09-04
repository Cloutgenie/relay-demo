import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/csv";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const events = await prisma.auditEvent.findMany({
    where: { tenantId: session.tenantId },
    include: { message: true },
    orderBy: { createdAt: "desc" },
    take: 2000,
  });
  const csv = toCsv(
    events.map((e) => ({
      when: e.createdAt.toISOString(),
      action: e.action,
      actor: e.actor,
      message: e.message?.text ?? "",
      detail: e.detail ?? "",
      category: e.message?.category ?? "",
      brand: e.message?.brand ?? "",
      campaign: e.message?.campaign ?? "",
    })),
  );
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=relay-history.csv",
    },
  });
}
