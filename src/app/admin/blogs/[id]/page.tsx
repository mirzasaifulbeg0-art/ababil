import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/blog-form";

export const metadata = {
  title: "Edit post — ABABIL Admin",
  description: "Edit a blog post.",
};

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [blog, categories] = await Promise.all([
    prisma.blog.findUnique({ where: { id } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!blog) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
        Edit post
      </h1>
      <div className="max-w-3xl">
        <BlogForm
          id={blog.id}
          categories={categories}
          defaultValues={{
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            coverImage: blog.coverImage,
            categoryId: blog.categoryId,
            metaTitle: blog.metaTitle,
            metaDescription: blog.metaDescription,
            published: blog.published,
          }}
        />
      </div>
    </div>
  );
}
