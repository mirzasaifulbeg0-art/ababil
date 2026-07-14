import Link from "next/link";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type BookCardData = {
  title: string;
  slug: string;
  author: string;
  language: string;
  coverImage: string | null;
  downloadCount: number;
  categoryName?: string | null;
};

export function BookCard({ book }: { book: BookCardData }) {
  return (
    <Link
      href={`/library/${book.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-brand-navy-50">
        {book.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="p-6 text-center">
            <div className="text-4xl">📖</div>
            <p className="mt-2 line-clamp-3 text-sm font-medium text-brand-navy-700">
              {book.title}
            </p>
          </div>
        )}
        <span className="absolute right-2 top-2">
          <Badge variant="navy">{book.language}</Badge>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-heading font-semibold text-brand-navy-800 group-hover:text-brand-green-600">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-slate-500">{book.author}</p>
        <div className="mt-auto flex items-center gap-1 pt-3 text-xs text-slate-400">
          <Download className="h-3.5 w-3.5" /> {book.downloadCount} downloads
        </div>
      </div>
    </Link>
  );
}
