import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteBook } from "@/lib/actions/admin";

export const metadata = {
  title: "Books — ABABIL Admin",
  description: "Manage the Islamic library.",
};

export default async function AdminBooksPage() {
  const books = await prisma.islamicBook.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
            Books
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {books.length} book{books.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button href="/admin/books/new">
          <Plus className="h-4 w-4" />
          New book
        </Button>
      </div>

      {books.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No books yet"
          description="Add your first book to the library."
          actionLabel="New book"
          actionHref="/admin/books/new"
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Author</th>
                  <th className="px-5 py-3 font-medium">Language</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {books.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-brand-navy-800">
                      {b.title}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{b.author}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {b.language.charAt(0) + b.language.slice(1).toLowerCase()}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {b.category?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={b.isActive ? "green" : "gray"}>
                        {b.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/books/${b.id}`}
                          className="text-sm font-medium text-brand-green-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteButton onDelete={deleteBook.bind(null, b.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
