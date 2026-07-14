import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Query-param based pagination. Preserves existing search params and only
 * swaps `page`. Rendered on the server, no client JS required.
 */
export function Pagination({
  page,
  totalPages,
  baseParams = {},
}: {
  page: number;
  totalPages: number;
  baseParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(baseParams)) {
      if (v) params.set(k, v);
    }
    params.set("page", String(p));
    return `?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="mt-10 flex items-center justify-center gap-1">
      {page > 1 && (
        <Link
          href={hrefFor(page - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
      {pages.map((p, idx) => {
        const gap = idx > 0 && p - pages[idx - 1] > 1;
        return (
          <span key={p} className="flex items-center">
            {gap && <span className="px-1 text-slate-400">…</span>}
            <Link
              href={hrefFor(p)}
              className={cn(
                "flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm",
                p === page
                  ? "border-brand-green-500 bg-brand-green-500 text-white"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {p}
            </Link>
          </span>
        );
      })}
      {page < totalPages && (
        <Link
          href={hrefFor(page + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
