import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, BookOpen, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "My Downloads",
  description: "Books you've downloaded from the ABABIL Islamic library.",
};

export default async function DownloadsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const downloads = await prisma.downloadHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { book: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-navy-800">
          My downloads
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Books you&apos;ve downloaded from the Islamic library.
        </p>
      </div>

      {downloads.length === 0 ? (
        <EmptyState
          icon={Download}
          title="No downloads yet"
          description="Explore the free Islamic library and your downloads will show up here."
          actionLabel="Browse the library"
          actionHref="/library"
        />
      ) : (
        <Card>
          <ul className="divide-y divide-slate-100">
            {downloads.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/library/${d.book.slug}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50 md:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-50 text-brand-green-600">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-brand-navy-800">
                        {d.book.title}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {d.book.author} · {formatDate(d.createdAt)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
