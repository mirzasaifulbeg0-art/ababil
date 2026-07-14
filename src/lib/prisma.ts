import { PrismaClient } from "@prisma/client";

/**
 * A single shared PrismaClient.
 *
 * In development Next.js reloads modules on every change. Without this guard we
 * would create a brand-new database connection on each reload and quickly run
 * out. We cache the client on the global object so it is reused.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
