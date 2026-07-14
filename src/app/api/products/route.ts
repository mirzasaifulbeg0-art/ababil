import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/products?search=&category=&featured=1 — public product list JSON. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const category = searchParams.get("category")?.trim();
  const featured = searchParams.get("featured");

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(featured ? { isFeatured: true } : {}),
      ...(category ? { category: { slug: category } } : {}),
      ...(search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {}),
    },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    success: true,
    data: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      stock: p.stock,
      image: p.images[0]?.url ?? null,
      category: p.category,
    })),
  });
}
