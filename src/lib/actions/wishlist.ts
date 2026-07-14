"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type ActionResult = { ok: boolean; error?: string; added?: boolean };

/** Add/remove a product from the logged-in user's wishlist. */
export async function toggleWishlist(productId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Please log in to save items." };
  }

  const key = {
    userId_productId: { userId: session.user.id, productId },
  };
  const existing = await prisma.wishlist.findUnique({ where: key });

  if (existing) {
    await prisma.wishlist.delete({ where: key });
    revalidatePath("/dashboard/wishlist");
    return { ok: true, added: false };
  }

  await prisma.wishlist.create({
    data: { userId: session.user.id, productId },
  });
  revalidatePath("/dashboard/wishlist");
  return { ok: true, added: true };
}
