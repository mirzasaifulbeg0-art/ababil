import Link from "next/link";
import type { Metadata } from "next";
import { Leaf } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { ProductCard } from "@/components/products/product-card";

export const metadata: Metadata = {
  title: "Natural Products",
  description:
    "Shop pure honey, organic grains, spices and herbal goods — sourced naturally and delivered across India.",
};

const PAGE_SIZE = 12;

const SORTS: Record<string, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  "price-asc": { price: "asc" },
  "price-desc": { price: "desc" },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const sp = await searchParams;
  const search = sp.search?.trim() ?? "";
  const category = sp.category ?? "";
  const sort = sp.sort && sp.sort in SORTS ? sp.sort : "newest";
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(category ? { category: { slug: category } } : {}),
  };

  const [categories, total, products] = await Promise.all([
    prisma.productCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: SORTS[sort],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        reviews: { select: { rating: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const cards = products.map((p) => {
    const reviewCount = p.reviews.length;
    const rating =
      reviewCount > 0
        ? p.reviews.reduce((n, r) => n + r.rating, 0) / reviewCount
        : undefined;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      stock: p.stock,
      image: p.images[0]?.url ?? null,
      rating,
      reviewCount,
    };
  });

  const baseParams = {
    search: search || undefined,
    category: category || undefined,
    sort: sort !== "newest" ? sort : undefined,
  };

  return (
    <div className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Natural Products"
          title="Pure, natural & wholesome"
          subtitle="Honey, organic grains, spices and herbal goods — carefully sourced and delivered to your door."
          align="left"
        />

        {/* Filter bar */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card md:flex-row md:items-end md:justify-between">
          <form method="get" className="flex flex-1 gap-2">
            {category && <input type="hidden" name="category" value={category} />}
            {sort !== "newest" && (
              <input type="hidden" name="sort" value={sort} />
            )}
            <Input
              name="search"
              defaultValue={search}
              placeholder="Search products…"
              className="max-w-xs"
            />
            <Button type="submit" variant="primary">
              Search
            </Button>
          </form>

          <form method="get" className="flex items-center gap-2">
            {search && <input type="hidden" name="search" value={search} />}
            {category && <input type="hidden" name="category" value={category} />}
            <label
              htmlFor="sort"
              className="text-sm font-medium text-brand-navy-800"
            >
              Sort
            </label>
            <Select
              id="sort"
              name="sort"
              defaultValue={sort}
              className="w-44"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </Select>
            <Button type="submit" variant="outline">
              Apply
            </Button>
          </form>
        </div>

        {/* Category pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          <CategoryPill
            href={pillHref({ search, sort })}
            active={!category}
            label="All"
          />
          {categories.map((c) => (
            <CategoryPill
              key={c.id}
              href={pillHref({ search, sort, category: c.slug })}
              active={category === c.slug}
              label={c.name}
            />
          ))}
        </div>

        {/* Results */}
        {cards.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={Leaf}
              title="No products found"
              description="Try a different search term or category."
              actionLabel="View all products"
              actionHref="/products"
            />
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cards.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              baseParams={baseParams}
            />
          </>
        )}
      </div>
    </div>
  );
}

function pillHref({
  search,
  sort,
  category,
}: {
  search?: string;
  sort?: string;
  category?: string;
}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (sort && sort !== "newest") params.set("sort", sort);
  if (category) params.set("category", category);
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

function CategoryPill({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-brand-green-500 bg-brand-green-500 text-white"
          : "border-slate-200 bg-white text-brand-navy-800 hover:border-brand-green-300 hover:bg-brand-green-50"
      )}
    >
      {label}
    </Link>
  );
}
