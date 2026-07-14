import type { Metadata } from "next";
import Link from "next/link";
import { Search, PenLine } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog/blog-card";

export const metadata: Metadata = {
  title: "Blog — Guides & Insights",
  description:
    "Helpful reads on government schemes, digital services, technology, AI, agriculture, health and Islamic knowledge from the ABABIL team.",
};

const PAGE_SIZE = 9;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
  const { search, category, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const where: Prisma.BlogWhereInput = {
    published: true,
    ...(category ? { category: { slug: category } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [categories, total, posts] = await Promise.all([
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.blog.count({ where }),
    prisma.blog.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (slug) params.set("category", slug);
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="From the blog"
          title="Guides & insights"
          subtitle="Helpful reads on schemes, technology, health, agriculture and Islamic knowledge."
        />

        {/* Search */}
        <form action="/blog" className="mx-auto mt-10 flex max-w-xl gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="search"
              defaultValue={search}
              placeholder="Search articles…"
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Category pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            href={buildHref()}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              !category
                ? "border-brand-green-500 bg-brand-green-500 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-green-300 hover:bg-brand-green-50"
            )}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={buildHref(c.slug)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                category === c.slug
                  ? "border-brand-green-500 bg-brand-green-500 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-green-300 hover:bg-brand-green-50"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {posts.length > 0 ? (
          <>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <BlogCard
                  key={p.slug}
                  post={{
                    title: p.title,
                    slug: p.slug,
                    excerpt: p.excerpt,
                    coverImage: p.coverImage,
                    publishedAt: p.publishedAt,
                    categoryName: p.category?.name,
                  }}
                />
              ))}
            </div>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              baseParams={{ search, category }}
            />
          </>
        ) : (
          <div className="mt-12">
            <EmptyState
              icon={PenLine}
              title="No articles found"
              description="Try a different search or category — we publish new articles regularly."
              actionLabel="View all articles"
              actionHref="/blog"
            />
          </div>
        )}
      </div>
    </section>
  );
}
