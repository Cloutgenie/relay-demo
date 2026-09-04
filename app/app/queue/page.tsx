import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QueueClient } from "@/components/queue-client";

export default async function QueuePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const items = await prisma.reviewItem.findMany({
    where: { tenantId: session.tenantId, status: "pending" },
    include: { message: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <QueueClient
      items={items.map((item) => ({
        id: item.id,
        text: item.message.text,
        author: item.message.author,
        channel: item.message.channel,
        category: item.suggestedCategory ?? item.message.category,
        brand: item.suggestedBrand ?? item.message.brand,
        campaign: item.suggestedCampaign ?? item.message.campaign,
      }))}
    />
  );
}
