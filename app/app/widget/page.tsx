import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WidgetClient } from "@/components/widget-client";

export default async function WidgetPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const message = await prisma.message.findFirst({
    where: { tenantId: session.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <WidgetClient
      message={
        message
          ? {
              id: message.id,
              text: message.text,
              author: message.author,
              channel: message.channel,
              category: message.category,
              brand: message.brand,
              campaign: message.campaign,
            }
          : null
      }
    />
  );
}
