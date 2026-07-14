import type { Metadata } from "next";
import Link from "next/link";
import { Search, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/services/service-card";

export const metadata: Metadata = {
  title: "Digital Services — Application Assistance",
  description:
    "Get help applying for PAN, Aadhaar, cards, insurance, tickets and more. ABABIL offers application-assistance for everyday digital services.",
};

export default async function DigitalServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;

  const [categories, services] = await Promise.all([
    prisma.serviceCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.digitalService.findMany({
      where: {
        isActive: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { shortDescription: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { category: { select: { name: true } } },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    }),
  ]);

  const buildHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (slug) params.set("category", slug);
    const qs = params.toString();
    return qs ? `/digital-services?${qs}` : "/digital-services";
  };

  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Digital Services"
          title="Application assistance, made simple"
          subtitle="We help you apply — from PAN and Aadhaar to insurance and tickets. This is application-assistance only; we are not affiliated with any government body."
        />

        {/* Search */}
        <form
          action="/digital-services"
          className="mx-auto mt-10 flex max-w-xl gap-2"
        >
          {category && <input type="hidden" name="category" value={category} />}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              name="search"
              defaultValue={search}
              placeholder="Search services…"
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Category pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            href={buildHref()}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              !category
                ? "border-brand-green-500 bg-brand-green-500 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-green-300 hover:bg-brand-green-50"
            )}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={buildHref(c.slug)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                category === c.slug
                  ? "border-brand-green-500 bg-brand-green-500 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-brand-green-300 hover:bg-brand-green-50"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {services.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard
                key={s.slug}
                service={{
                  name: s.name,
                  slug: s.slug,
                  shortDescription: s.shortDescription,
                  serviceCharge: Number(s.serviceCharge),
                  processingTime: s.processingTime,
                  categoryName: s.category?.name,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12">
            <EmptyState
              icon={FileText}
              title="No services found"
              description="Try a different search or category — new services are added regularly."
              actionLabel="View all services"
              actionHref="/digital-services"
            />
          </div>
        )}
      </div>
    </section>
  );
}
