import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/blog-form";

export const metadata = {
  title: "New post — ABABIL Admin",
  description: "Write a new blog post.",
};

export default async function NewBlogPage() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
        New post
      </h1>
      <div className="max-w-3xl">
        <BlogForm id={null} categories={categories} />
      </div>
    </div>
  );
}
