import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { BookCard } from "@/components/library/book-card";
import { DownloadButton } from "@/components/library/download-button";

async function getBook(slug: string) {
  return prisma.islamicBook.findFirst({
    where: { slug, isActive: true },
    include: { category: { select: { name: true } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return { title: "Book not found" };
  return {
    title: `${book.title} by ${book.author} — Islamic Library`,
    description: book.description.slice(0, 160),
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) notFound();

  const related = book.categoryId
    ? await prisma.islamicBook.findMany({
        where: {
          isActive: true,
          categoryId: book.categoryId,
          id: { not: book.id },
        },
        include: { category: { select: { name: true } } },
        orderBy: { downloadCount: "desc" },
        take: 4,
      })
    : [];

  const languageLabel =
    book.language.charAt(0) + book.language.slice(1).toLowerCase();

  return (
    <section className="section">
      <div className="container">
        <Link
          href="/library"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-green-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to library
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-3">
          {/* Cover */}
          <div className="md:col-span-1">
            <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-brand-navy-50 shadow-card">
              {book.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="p-6 text-center">
                  <div className="text-6xl">📖</div>
                  <p className="mt-3 font-heading font-medium text-brand-navy-700">
                    {book.title}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="navy">{languageLabel}</Badge>
              {book.category?.name && (
                <Badge variant="green">{book.category.name}</Badge>
              )}
            </div>
            <h1 className="mt-3 font-heading text-3xl font-bold text-brand-navy-800 md:text-4xl">
              {book.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-slate-600">
              <User className="h-4 w-4" /> {book.author}
            </p>

            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-700">
              {book.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <DownloadButton bookId={book.id} />
              <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                <Download className="h-4 w-4" /> {book.downloadCount} downloads
              </span>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              This book is part of the public domain and shared free of charge
              for the benefit of readers.
            </p>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-semibold text-brand-navy-800">
              Related books
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((b) => (
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
          </div>
        )}
      </div>
    </section>
  );
}
