import { prisma } from "@/lib/prisma";
import { BookForm } from "@/components/admin/book-form";

export const metadata = {
  title: "New book — ABABIL Admin",
  description: "Add a book to the library.",
};

export default async function NewBookPage() {
  const categories = await prisma.bookCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
        New book
      </h1>
      <div className="max-w-2xl">
        <BookForm id={null} categories={categories} />
      </div>
    </div>
  );
}
