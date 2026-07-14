import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = {
  title: "New product — ABABIL Admin",
  description: "Create a new product.",
};

export default async function NewProductPage() {
  const categories = await prisma.productCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
        New product
      </h1>
      <div className="max-w-2xl">
        <ProductForm id={null} categories={categories} />
      </div>
    </div>
  );
}
