import { prisma } from "@/lib/prisma";
import { sprinklr } from "@/lib/sprinklr/client";
import type { CustomFieldWrite } from "@/lib/sprinklr/types";

const HOURLY_LIMIT = 1000;
const MIN_GAP_MS = Math.ceil((60 * 60 * 1000) / HOURLY_LIMIT);
const BATCH_WINDOW_MS = 400;

let flushTimer: ReturnType<typeof setTimeout> | null = null;
let lastSentAt = 0;

/**
 * Debounce + batch custom-property writes.
 * Multiple tag fields on one message collapse into a single Sprinklr request.
 * ~1000 req/hr default tenant limit → minimum gap between outbound calls.
 */
export async function enqueueWrite(
  tenantId: string,
  messageId: string,
  payload: CustomFieldWrite,
) {
  const existing = await prisma.writeJob.findFirst({
    where: { tenantId, messageId, status: "queued" },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    const prev = existing.payload as CustomFieldWrite;
    await prisma.writeJob.update({
      where: { id: existing.id },
      data: {
        payload: {
          ...prev,
          properties: { ...prev.properties, ...payload.properties },
        },
      },
    });
  } else {
    await prisma.writeJob.create({
      data: { tenantId, messageId, payload, status: "queued" },
    });
  }

  scheduleFlush();
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushWriteQueue();
  }, BATCH_WINDOW_MS);
}

export async function flushWriteQueue(limit = 8) {
  const jobs = await prisma.writeJob.findMany({
    where: { status: "queued" },
    orderBy: { scheduledAt: "asc" },
    take: limit,
  });

  for (const job of jobs) {
    const wait = lastSentAt + MIN_GAP_MS - Date.now();
    if (wait > 0) {
      await new Promise((r) => setTimeout(r, Math.min(wait, 50)));
    }

    try {
      const result = await sprinklr.writeCustomProperties(
        job.payload as CustomFieldWrite,
      );
      lastSentAt = Date.now();
      await prisma.writeJob.update({
        where: { id: job.id },
        data: {
          status: result.mocked ? "mocked" : "sent",
          attempts: { increment: 1 },
          sentAt: new Date(),
        },
      });
      await prisma.message.update({
        where: { id: job.messageId },
        data: { writtenBack: true, writtenAt: new Date() },
      });
    } catch (error) {
      await prisma.writeJob.update({
        where: { id: job.id },
        data: {
          status: "failed",
          attempts: { increment: 1 },
          lastError: error instanceof Error ? error.message : "write failed",
        },
      });
    }
  }
}
