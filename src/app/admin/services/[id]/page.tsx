import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/components/admin/service-form";

export const metadata = {
  title: "Edit service — ABABIL Admin",
  description: "Edit a digital service.",
};

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [service, categories] = await Promise.all([
    prisma.digitalService.findUnique({ where: { id } }),
    prisma.serviceCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!service) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
        Edit service
      </h1>
      <div className="max-w-2xl">
        <ServiceForm
          id={service.id}
          categories={categories}
          defaultValues={{
            name: service.name,
            shortDescription: service.shortDescription,
            description: service.description,
            requiredDocuments: service.requiredDocuments,
            eligibility: service.eligibility,
            processingTime: service.processingTime,
            serviceCharge: Number(service.serviceCharge),
            categoryId: service.categoryId,
            isActive: service.isActive,
            isFeatured: service.isFeatured,
          }}
        />
      </div>
    </div>
  );
}
