import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type BlogCardData = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | string | null;
  categoryName?: string | null;
};

export function BlogCard({ post }: { post: BlogCardData }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">
            ✍️
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.categoryName && (
          <Badge variant="green" className="w-fit">
            {post.categoryName}
          </Badge>
        )}
        <h3 className="mt-2 line-clamp-2 font-heading text-lg font-semibold text-brand-navy-800 group-hover:text-brand-green-600">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">
          {post.excerpt}
        </p>
        {post.publishedAt && (
          <div className="mt-4 flex items-center gap-1 text-xs text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" /> {formatDate(post.publishedAt)}
          </div>
        )}
      </div>
    </Link>
  );
}
