import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookForm } from "@/components/admin/book-form";

export const metadata = {
  title: "Edit book — ABABIL Admin",
  description: "Edit a library book.",
};

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [book, categories] = await Promise.all([
    prisma.islamicBook.findUnique({ where: { id } }),
    prisma.bookCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!book) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
        Edit book
      </h1>
      <div className="max-w-2xl">
        <BookForm
          id={book.id}
          categories={categories}
          defaultValues={{
            title: book.title,
            author: book.author,
            language: book.language,
            description: book.description,
            coverImage: book.coverImage,
            pdfUrl: book.pdfUrl,
            categoryId: book.categoryId,
            isActive: book.isActive,
          }}
        />
      </div>
    </div>
  );
}
