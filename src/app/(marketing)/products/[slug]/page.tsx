import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, X } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice, formatDate, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/shared/rating";
import { SectionHeading } from "@/components/shared/section-heading";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { ProductCard } from "@/components/products/product-card";
import { ReviewForm } from "@/components/products/review-form";

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    select: { name: true, description: true },
  });
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: truncate(product.description, 155),
  };
}

/** Split "\n"-separated text into clean bullet items. */
function toList(text: string | null): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, session] = await Promise.all([getProduct(slug), auth()]);

  if (!product) notFound();

  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice
    ? Number(product.compareAtPrice)
    : null;
  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const reviewCount = product.reviews.length;
  const avgRating =
    reviewCount > 0
      ? product.reviews.reduce((n, r) => n + r.rating, 0) / reviewCount
      : 0;

  const inStock = product.stock > 0;
  const benefits = toList(product.benefits);
  const ingredients = toList(product.ingredients);
  const mainImage = product.images[0]?.url ?? null;

  const related = product.categoryId
    ? await prisma.product.findMany({
        where: {
          isActive: true,
          categoryId: product.categoryId,
          id: { not: product.id },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
        include: {
          images: { orderBy: { position: "asc" }, take: 1 },
          reviews: { select: { rating: true } },
        },
      })
    : [];

  return (
    <div className="section">
      <div className="container">
        {/* Main product */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="aspect-square overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              {mainImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mainImage}
                  alt={product.images[0]?.alt ?? product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl">
                  🍯
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    className="aspect-square overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.alt ?? product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <Badge variant="green">{product.category.name}</Badge>
            )}
            <h1 className="mt-3 font-heading text-3xl font-bold text-brand-navy-900 md:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <Rating value={avgRating} count={reviewCount} />
              {reviewCount === 0 && (
                <span className="text-xs text-slate-500">No reviews yet</span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-brand-navy-900">
                {formatPrice(price)}
              </span>
              {compareAtPrice && compareAtPrice > price && (
                <span className="text-lg text-slate-400 line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
              {discount && <Badge variant="red">-{discount}% OFF</Badge>}
            </div>

            <div className="mt-4">
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-green-600">
                  <Check className="h-4 w-4" />
                  In stock{product.stock <= 10 && ` — only ${product.stock} left`}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600">
                  <X className="h-4 w-4" />
                  Out of stock
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-5 whitespace-pre-line text-slate-600">
                {product.description}
              </p>
            )}

            <div className="mt-6">
              <AddToCartButton
                productId={product.id}
                disabled={!inStock}
                size="lg"
                className="w-full sm:w-auto"
              />
            </div>

            {benefits.length > 0 && (
              <div className="mt-8">
                <h2 className="font-heading text-lg font-semibold text-brand-navy-800">
                  Benefits
                </h2>
                <ul className="mt-3 space-y-2">
                  {benefits.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-600"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-500" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {ingredients.length > 0 && (
              <div className="mt-6">
                <h2 className="font-heading text-lg font-semibold text-brand-navy-800">
                  Ingredients
                </h2>
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-600">
                  {ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <SectionHeading title="Customer reviews" align="left" />
          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {reviewCount === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-sm text-slate-500">
                  No reviews yet. Be the first to share your experience.
                </p>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-brand-navy-800">
                          {review.user.name ?? "Anonymous"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <div className="mt-1">
                        <Rating value={review.rating} />
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-3 font-heading text-lg font-semibold text-brand-navy-800">
                Write a review
              </h3>
              <ReviewForm
                productId={product.id}
                isAuthed={Boolean(session?.user?.id)}
              />
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <SectionHeading title="Related products" align="left" />
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => {
                const rc = p.reviews.length;
                const avg =
                  rc > 0
                    ? p.reviews.reduce((n, r) => n + r.rating, 0) / rc
                    : undefined;
                return (
                  <ProductCard
                    key={p.id}
                    product={{
                      id: p.id,
                      name: p.name,
                      slug: p.slug,
                      price: Number(p.price),
                      compareAtPrice: p.compareAtPrice
                        ? Number(p.compareAtPrice)
                        : null,
                      stock: p.stock,
                      image: p.images[0]?.url ?? null,
                      rating: avg,
                      reviewCount: rc,
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
