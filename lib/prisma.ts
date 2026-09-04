import { PrismaClient } from "@prisma/client";
import { HOSTED_DATABASE_URL } from "@/lib/hosted-database";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = HOSTED_DATABASE_URL;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
