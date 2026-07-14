"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";

export type ActionResult = { ok: boolean; error?: string };

/** Add or update the current user's review for a product. */
export async function submitReview(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Please log in to write a review." };
  }

  const parsed = reviewSchema.safeParse({
    productId: formData.get("productId"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { productId, rating, comment } = parsed.data;
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  });
  if (!product) return { ok: false, error: "Product not found." };

  await prisma.review.upsert({
    where: { productId_userId: { productId, userId: session.user.id } },
    update: { rating, comment },
    create: { productId, userId: session.user.id, rating, comment },
  });

  revalidatePath(`/products/${product.slug}`);
  return { ok: true };
}
