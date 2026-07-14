import type { Metadata } from "next";
import {
  FileText,
  Leaf,
  BookOpen,
  PenLine,
  Sprout,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  BookMarked,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About ABABIL",
  description:
    "ABABIL brings together digital service assistance, natural products, a free Islamic PDF library and helpful blogs — built on Nature, Technology and Trust.",
};

const PILLARS = [
  {
    title: "Digital Services",
    desc: "Application assistance for PAN, Aadhaar, cards, insurance, tickets and more — so paperwork never holds you back.",
    icon: FileText,
  },
  {
    title: "Natural Products",
    desc: "Pure honey, organic grains, spices and herbal goods, sourced with care and delivered to your door.",
    icon: Leaf,
  },
  {
    title: "Islamic Library",
    desc: "A growing, free collection of public-domain Islamic PDF books to read and download anytime.",
    icon: BookOpen,
  },
  {
    title: "Blog",
    desc: "Practical guides on government schemes, technology, health, agriculture and Islamic knowledge.",
    icon: PenLine,
  },
];

const VALUES = [
  {
    title: "Nature",
    desc: "We champion pure, natural and wholesome products, and knowledge that nourishes.",
    icon: Sprout,
  },
  {
    title: "Technology",
    desc: "We use modern technology to make everyday services simpler and more accessible.",
    icon: Cpu,
  },
  {
    title: "Trust",
    desc: "We are transparent about what we do — and just as clear about what we don't.",
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-green-50/60 to-white">
        <div className="container py-20 text-center md:py-28">
          <span className="inline-block rounded-full bg-white px-4 py-1 text-sm font-semibold text-brand-green-700 shadow-card">
            {SITE.tagline}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl font-heading text-4xl font-bold leading-tight text-brand-navy-800 md:text-5xl">
            One trusted platform for everyday needs
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            {SITE.description}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Our mission"
            title="Making everyday life simpler, together"
            subtitle="ABABIL exists to bring helpful, honest services under one roof — from digital paperwork assistance to natural products, free knowledge and practical guidance. We combine the goodness of nature with the convenience of technology, and we earn trust by being transparent every step of the way."
          />
        </div>
      </section>

      {/* Pillars */}
      <section className="section bg-slate-50/60">
        <div className="container">
          <SectionHeading eyebrow="What we do" title="Four pillars, one platform" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <Card key={p.title} className="transition-all hover:-translate-y-1 hover:shadow-card-hover">
                <CardBody>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-50 text-brand-green-600">
                    <p.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4">{p.title}</CardTitle>
                  <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Our values"
            title="Nature • Technology • Trust"
            subtitle="Three principles guide everything we build."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-card"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-50 text-brand-green-600">
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold text-brand-navy-800">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency notes */}
      <section className="section bg-slate-50/60">
        <div className="container grid gap-6 md:grid-cols-2">
          <div className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <ShieldAlert className="h-6 w-6 shrink-0 text-amber-600" />
            <div>
              <h3 className="font-heading text-lg font-semibold text-amber-900">
                Application-assistance only
              </h3>
              <p className="mt-1 text-sm text-amber-800">
                Our digital services help you prepare and submit applications.
                We are not affiliated with any government body, and our service
                charge is separate from any official government fees.
              </p>
            </div>
          </div>
          <div className="flex gap-4 rounded-2xl border border-brand-green-100 bg-brand-green-50 p-6">
            <BookMarked className="h-6 w-6 shrink-0 text-brand-green-600" />
            <div>
              <h3 className="font-heading text-lg font-semibold text-brand-navy-800">
                Public-domain library
              </h3>
              <p className="mt-1 text-sm text-slate-700">
                The Islamic Library holds only public-domain books, shared free
                of charge so that beneficial knowledge is accessible to all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-green-600 to-brand-green-500 px-8 py-14 text-center text-white md:py-20">
            <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
              Have a question? We&apos;d love to help.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-green-50">
              Reach out to our team and we&apos;ll get back to you as soon as we
              can.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/contact" size="lg" variant="navy">
                Contact us
              </Button>
              <Button
                href="/digital-services"
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                Explore services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
