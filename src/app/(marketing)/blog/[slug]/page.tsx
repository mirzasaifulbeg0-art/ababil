import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/blog/blog-card";

async function getPost(slug: string) {
  return prisma.blog.findFirst({
    where: { slug, published: true },
    include: {
      category: { select: { name: true } },
      author: { select: { name: true } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.metaTitle || `${post.title} — ABABIL Blog`,
    description: post.metaDescription || post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = post.categoryId
    ? await prisma.blog.findMany({
        where: {
          published: true,
          categoryId: post.categoryId,
          id: { not: post.id },
        },
        include: { category: { select: { name: true } } },
        orderBy: { publishedAt: "desc" },
        take: 3,
      })
    : [];

  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="section">
      <div className="container">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-green-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>

        <div className="mx-auto mt-6 max-w-3xl">
          {post.category?.name && (
            <Badge variant="green" className="w-fit">
              {post.category.name}
            </Badge>
          )}
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-brand-navy-800 md:text-4xl">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {post.author?.name && (
              <span className="inline-flex items-center gap-1.5">
                <User className="h-4 w-4" /> {post.author.name}
              </span>
            )}
            {post.publishedAt && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(post.publishedAt)}
              </span>
            )}
          </div>

          {/* Cover */}
          {post.coverImage && (
            <div className="mt-8 overflow-hidden rounded-2xl bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="mt-8 max-w-none space-y-5 text-base leading-relaxed text-slate-700">
            {paragraphs.map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mx-auto mt-16 max-w-5xl">
            <h2 className="font-heading text-2xl font-semibold text-brand-navy-800">
              Related articles
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {related.map((p) => (
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
          </div>
        )}
      </div>
    </article>
  );
}
