import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET /api/services?search=&category= — public digital-services list JSON. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const category = searchParams.get("category")?.trim();

  const services = await prisma.digitalService.findMany({
    where: {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(search
        ? { name: { contains: search, mode: "insensitive" as const } }
        : {}),
    },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });

  return NextResponse.json({
    success: true,
    data: services.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      shortDescription: s.shortDescription,
      serviceCharge: Number(s.serviceCharge),
      processingTime: s.processingTime,
      category: s.category,
    })),
  });
}
