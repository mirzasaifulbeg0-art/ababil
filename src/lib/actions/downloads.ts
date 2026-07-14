"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type DownloadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Records a download (for history + counter) and returns the PDF URL.
 * Called when a visitor clicks "Download" on a library book.
 */
export async function registerDownload(bookId: string): Promise<DownloadResult> {
  const book = await prisma.islamicBook.findFirst({
    where: { id: bookId, isActive: true },
    select: { id: true, pdfUrl: true },
  });
  if (!book) return { ok: false, error: "Book not found." };

  const session = await auth();

  await prisma.$transaction([
    prisma.islamicBook.update({
      where: { id: bookId },
      data: { downloadCount: { increment: 1 } },
    }),
    prisma.downloadHistory.create({
      data: { bookId, userId: session?.user?.id ?? null },
    }),
  ]);

  return { ok: true, url: book.pdfUrl };
}
