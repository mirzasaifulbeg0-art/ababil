import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Leaf,
  BookOpen,
  PenLine,
  ShieldCheck,
  Truck,
  BadgeCheck,
  Headphones,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { Rating } from "@/components/shared/rating";
import { ProductCard } from "@/components/products/product-card";
import { ServiceCard } from "@/components/services/service-card";
import { BookCard } from "@/components/library/book-card";
import { BlogCard } from "@/components/blog/blog-card";

export const revalidate = 60; // refresh homepage data every minute

const PILLARS = [
  {
    title: "Digital Services",
    desc: "Application assistance for PAN, Aadhaar, cards, insurance & more.",
    href: "/digital-services",
    icon: FileText,
  },
  {
    title: "Natural Products",
    desc: "Pure honey, organic grains, spices and herbal goods.",
    href: "/products",
    icon: Leaf,
  },
  {
    title: "Islamic Library",
    desc: "Free, public-domain Islamic PDF books to read and download.",
    href: "/library",
    icon: BookOpen,
  },
  {
    title: "Blog",
    desc: "Guides on schemes, technology, health and Islamic knowledge.",
    href: "/blog",
    icon: PenLine,
  },
];

const TRUST = [
  { icon: ShieldCheck, title: "Trusted & Secure", desc: "Your data is safe with us." },
  { icon: BadgeCheck, title: "Genuine Products", desc: "100% pure & authentic." },
  { icon: Truck, title: "Fast Delivery", desc: "Free shipping over ₹999." },
  { icon: Headphones, title: "Real Support", desc: "We're here to help you." },
];

export default async function HomePage() {
  const [products, services, books, posts, testimonials] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        reviews: { select: { rating: true } },
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.digitalService.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: { select: { name: true } } },
      take: 3,
    }),
    prisma.islamicBook.findMany({
      where: { isActive: true },
      include: { category: { select: { name: true } } },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
    prisma.blog.findMany({
      where: { published: true },
      include: { category: { select: { name: true } } },
      take: 3,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.testimonial.findMany({
      where: { isActive: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-green-50/60 to-white">
        <div className="container grid gap-10 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div className="animate-fade-in">
            <span className="inline-block rounded-full bg-white px-4 py-1 text-sm font-semibold text-brand-green-700 shadow-card">
              {SITE.tagline}
            </span>
            <h1 className="mt-5 text-4xl leading-tight md:text-6xl">
              One trusted platform for{" "}
              <span className="text-brand-green-600">everyday needs</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              {SITE.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/digital-services" size="lg">
                Explore Services <ArrowRight className="h-5 w-5" />
              </Button>
              <Button href="/products" size="lg" variant="outline">
                Shop Natural Products
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {PILLARS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <p.icon className="h-8 w-8 text-brand-green-600" />
                <div className="mt-3 font-heading font-semibold text-brand-navy-800">
                  {p.title}
                </div>
                <p className="mt-1 text-xs text-slate-500">{p.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-slate-100 bg-white">
        <div className="container grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-green-50 text-brand-green-600">
                <t.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm font-semibold text-brand-navy-800">
                  {t.title}
                </div>
                <div className="text-xs text-slate-500">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured services */}
      {services.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Digital Services"
              title="Application assistance, made simple"
              subtitle="We help you apply — from PAN and Aadhaar to insurance and more."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
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
            <div className="mt-8 text-center">
              <Button href="/digital-services" variant="outline">
                View all services <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      {products.length > 0 && (
        <section className="section bg-slate-50/60">
          <div className="container">
            <SectionHeading
              eyebrow="Natural Products"
              title="Pure. Natural. Trusted."
              subtitle="Honey, grains, spices and herbal goods sourced with care."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => {
                const ratings = p.reviews.map((r) => r.rating);
                const avg =
                  ratings.length > 0
                    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                    : undefined;
                return (
                  <ProductCard
                    key={p.slug}
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
                      reviewCount: ratings.length,
                    }}
                  />
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Button href="/products" variant="outline">
                Shop all products <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Library */}
      {books.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Islamic Library"
              title="Free books to read & download"
              subtitle="A growing collection of public-domain Islamic PDFs."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {books.map((b) => (
                <BookCard
                  key={b.slug}
                  book={{
                    title: b.title,
                    slug: b.slug,
                    author: b.author,
                    language: b.language,
                    coverImage: b.coverImage,
                    downloadCount: b.downloadCount,
                    categoryName: b.category?.name,
                  }}
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button href="/library" variant="outline">
                Browse the library <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section bg-brand-navy-900 text-white">
          <div className="container">
            <SectionHeading
              eyebrow="Testimonials"
              title="Loved by our customers"
              className="[&_h2]:text-white"
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10"
                >
                  <Rating value={t.rating} />
                  <p className="mt-4 text-slate-200">“{t.content}”</p>
                  <div className="mt-4 text-sm font-semibold text-white">
                    {t.name}
                    {t.role && (
                      <span className="ml-1 font-normal text-slate-400">
                        · {t.role}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest blog */}
      {posts.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="From the blog"
              title="Guides & insights"
              subtitle="Helpful reads on schemes, technology, health and more."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {posts.map((p) => (
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
        </section>
      )}

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-green-600 to-brand-green-500 px-8 py-14 text-center text-white md:py-20">
            <h2 className="text-3xl text-white md:text-4xl">
              Ready to get started with ABABIL?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-green-50">
              Create a free account to track your service requests, orders and
              downloads in one place.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/register" size="lg" variant="navy">
                Create free account
              </Button>
              <Button
                href="/contact"
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                Contact us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
