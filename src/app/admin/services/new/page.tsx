import { prisma } from "@/lib/prisma";
import { ServiceForm } from "@/components/admin/service-form";

export const metadata = {
  title: "New service — ABABIL Admin",
  description: "Create a new digital service.",
};

export default async function NewServicePage() {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
        New service
      </h1>
      <div className="max-w-2xl">
        <ServiceForm id={null} categories={categories} />
      </div>
    </div>
  );
}
