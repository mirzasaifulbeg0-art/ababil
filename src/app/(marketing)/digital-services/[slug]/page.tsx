import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, IndianRupee, FileCheck2, ShieldAlert, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { ServiceRequestForm } from "@/components/services/service-request-form";

async function getService(slug: string) {
  return prisma.digitalService.findFirst({
    where: { slug, isActive: true },
    include: { category: { select: { name: true } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: `${service.name} — Digital Services`,
    description: service.shortDescription,
  };
}

function toList(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•\s]+/, "").trim())
    .filter(Boolean);
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const session = await auth();
  const documents = toList(service.requiredDocuments);
  const eligibility = toList(service.eligibility);

  return (
    <section className="section">
      <div className="container">
        <Link
          href="/digital-services"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-green-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-5">
          {/* Left: details */}
          <div className="lg:col-span-3">
            {service.category?.name && (
              <Badge variant="green" className="w-fit">
                {service.category.name}
              </Badge>
            )}
            <h1 className="mt-3 font-heading text-3xl font-bold text-brand-navy-800 md:text-4xl">
              {service.name}
            </h1>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-green-600" />
                {service.processingTime}
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-brand-green-700">
                <IndianRupee className="h-4 w-4" />
                {formatPrice(Number(service.serviceCharge))} service charge
              </span>
            </div>

            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-700">
              {service.description}
            </p>

            {/* Disclaimer */}
            <div className="mt-8 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                <strong>Please note:</strong> This is application-assistance only
                — we are not affiliated with any government body. The service
                charge covers our assistance and is separate from any official
                government fees.
              </p>
            </div>

            {/* Required documents */}
            {documents.length > 0 && (
              <div className="mt-8">
                <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-brand-navy-800">
                  <FileCheck2 className="h-5 w-5 text-brand-green-600" />
                  Required documents
                </h2>
                <ul className="mt-3 space-y-2">
                  {documents.map((doc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-500" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Eligibility */}
            {eligibility.length > 0 && (
              <div className="mt-8">
                <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-brand-navy-800">
                  <CheckCircle2 className="h-5 w-5 text-brand-green-600" />
                  Eligibility
                </h2>
                <ul className="mt-3 space-y-2">
                  {eligibility.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: application form */}
          <div className="lg:col-span-2">
            <Card className="lg:sticky lg:top-24">
              <CardBody>
                <h2 className="font-heading text-xl font-semibold text-brand-navy-800">
                  Apply for this service
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Fill in your details and our team will get in touch to assist
                  with your application.
                </p>
                <div className="mt-5">
                  <ServiceRequestForm
                    serviceId={service.id}
                    defaultName={session?.user?.name ?? undefined}
                    defaultEmail={session?.user?.email ?? undefined}
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
