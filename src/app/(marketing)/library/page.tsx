import type { Metadata } from "next";
import Link from "next/link";
import { Search, BookOpen } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { BookCard } from "@/components/library/book-card";

export const metadata: Metadata = {
  title: "Islamic Library — Free PDF Books",
  description:
    "Browse and download a growing collection of free, public-domain Islamic PDF books across Quran, Tafsir, Hadith, Fiqh, Seerah and more.",
};

const PAGE_SIZE = 12;

const LANGUAGES = [
  "ARABIC",
  "ENGLISH",
  "BENGALI",
  "URDU",
  "HINDI",
  "OTHER",
] as const;

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    language?: string;
    page?: string;
  }>;
}) {
  const { search, category, language, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const where: Prisma.IslamicBookWhereInput = {
    isActive: true,
    ...(category ? { category: { slug: category } } : {}),
    ...(language && LANGUAGES.includes(language as (typeof LANGUAGES)[number])
      ? { language: language as (typeof LANGUAGES)[number] }
      : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { author: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [categories, total, books] = await Promise.all([
    prisma.bookCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.islamicBook.count({ where }),
    prisma.islamicBook.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (language) params.set("language", language);
    if (slug) params.set("category", slug);
    const qs = params.toString();
    return qs ? `/library?${qs}` : "/library";
  };

  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Islamic Library"
          title="Free books to read & download"
          subtitle="A growing collection of public-domain Islamic PDFs — free for everyone."
        />

        {/* Search + language filter */}
        <form
          action="/library"
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-2 sm:flex-row"
        >
          {category && <input type="hidden" name="category" value={category} />}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="search"
              defaultValue={search}
              placeholder="Search by title or author…"
              className="pl-9"
            />
          </div>
          <Select name="language" defaultValue={language ?? ""} className="sm:w-44">
            <option value="">All languages</option>
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0) + lang.slice(1).toLowerCase()}
              </option>
            ))}
          </Select>
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
        {books.length > 0 ? (
          <>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {books.map((b) => (
                <BookCard
                  key={b.slug}
                  book={{
                    title: b.title,
                    slug: b.slug,
                    author: b.author,
                    language: b.language,
                    coverImage: b.coverImage,
                    downloadCount: b.downloadCount,
                    categoryName: b.category?.name,
                  }}
                />
              ))}
            </div>
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              baseParams={{ search, category, language }}
            />
          </>
        ) : (
          <div className="mt-12">
            <EmptyState
              icon={BookOpen}
              title="No books found"
              description="Try a different search, language or category — new books are added regularly."
              actionLabel="View all books"
              actionHref="/library"
            />
          </div>
        )}
      </div>
    </section>
  );
}
