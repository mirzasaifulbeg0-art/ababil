import Link from "next/link";
import { Newspaper, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteBlog } from "@/lib/actions/admin";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blogs — ABABIL Admin",
  description: "Manage blog posts.",
};

export default async function AdminBlogsPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
            Blog posts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {blogs.length} post{blogs.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button href="/admin/blogs/new">
          <Plus className="h-4 w-4" />
          New post
        </Button>
      </div>

      {blogs.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No posts yet"
          description="Write your first blog post."
          actionLabel="New post"
          actionHref="/admin/blogs/new"
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {blogs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-brand-navy-800">
                      {b.title}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {b.category?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {formatDate(b.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={b.published ? "green" : "gray"}>
                        {b.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blogs/${b.id}`}
                          className="text-sm font-medium text-brand-green-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteButton onDelete={deleteBlog.bind(null, b.id)} />
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
