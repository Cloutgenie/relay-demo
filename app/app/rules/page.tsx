import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RulesClient } from "@/components/rules-client";

export default async function RulesPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [rules, terms] = await Promise.all([
    prisma.rule.findMany({
      where: { tenantId: session.tenantId },
      orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
    }),
    prisma.taxonomyTerm.findMany({
      where: { tenantId: session.tenantId },
      orderBy: [{ tagType: "asc" }, { label: "asc" }],
    }),
  ]);

  return (
    <RulesClient
      rules={rules.map((r) => ({
        id: r.id,
        name: r.name,
        enabled: r.enabled,
        tagType: r.tagType,
        tagValue: r.tagValue,
        matchType: r.matchType,
        pattern: r.pattern,
        source: r.source,
      }))}
      terms={terms.map((t) => ({
        id: t.id,
        tagType: t.tagType,
        label: t.label,
      }))}
    />
  );
}
