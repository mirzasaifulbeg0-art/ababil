import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = {
  title: "Edit product — ABABIL Admin",
  description: "Edit a product.",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
    }),
    prisma.productCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
        Edit product
      </h1>
      <div className="max-w-2xl">
        <ProductForm
          id={product.id}
          categories={categories}
          defaultValues={{
            name: product.name,
            description: product.description,
            benefits: product.benefits,
            ingredients: product.ingredients,
            price: Number(product.price),
            compareAtPrice:
              product.compareAtPrice != null
                ? Number(product.compareAtPrice)
                : null,
            stock: product.stock,
            categoryId: product.categoryId,
            imageUrl: product.images[0]?.url ?? "",
            isActive: product.isActive,
            isFeatured: product.isFeatured,
          }}
        />
      </div>
    </div>
  );
}
