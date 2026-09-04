import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sprinklr } from "@/lib/sprinklr/client";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const checks = await sprinklr.checkCustomFields();
  for (const check of checks) {
    let fieldId = check.sprinklrFieldId;
    if (!check.exists) {
      const created = await sprinklr.createCustomField(check.tagType, check.entityType);
      fieldId = created.id;
    }
    await prisma.fieldMap.upsert({
      where: {
        tenantId_tagType_entityType: {
          tenantId: session.tenantId,
          tagType: check.tagType,
          entityType: check.entityType,
        },
      },
      update: {
        existsInTenant: true,
        sprinklrFieldId: fieldId,
        fieldName: check.fieldName,
      },
      create: {
        tenantId: session.tenantId,
        tagType: check.tagType,
        entityType: check.entityType,
        fieldName: check.fieldName,
        sprinklrFieldId: fieldId,
        existsInTenant: true,
      },
    });
  }

  const fields = await prisma.fieldMap.findMany({
    where: { tenantId: session.tenantId },
  });
  return NextResponse.json({ fields });
}
