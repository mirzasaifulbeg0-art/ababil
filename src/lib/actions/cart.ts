"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { CART_COOKIE, readCartCookie } from "@/lib/cart";

async function writeCart(items: { productId: string; quantity: number }[]) {
  const jar = await cookies();
  const clean = items.filter((i) => i.quantity > 0);
  jar.set(CART_COOKIE, JSON.stringify(clean), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

/** Add a product to the cart (or bump its quantity). Clamps to stock. */
export async function addToCart(productId: string, quantity = 1) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true, isActive: true },
  });
  if (!product || !product.isActive || product.stock <= 0) {
    return { ok: false, error: "This product is unavailable." };
  }

  const items = await readCartCookie();
  const existing = items.find((i) => i.productId === productId);
  const nextQty = Math.min((existing?.quantity ?? 0) + quantity, product.stock);

  if (existing) existing.quantity = nextQty;
  else items.push({ productId, quantity: nextQty });

  await writeCart(items);
  revalidatePath("/cart");
  return { ok: true };
}

/** Set an exact quantity for a line (0 removes it). */
export async function updateCartItem(productId: string, quantity: number) {
  let items = await readCartCookie();
  if (quantity <= 0) {
    items = items.filter((i) => i.productId !== productId);
  } else {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    });
    const clamped = Math.min(quantity, product?.stock ?? quantity);
    const existing = items.find((i) => i.productId === productId);
    if (existing) existing.quantity = clamped;
    else items.push({ productId, quantity: clamped });
  }
  await writeCart(items);
  revalidatePath("/cart");
  return { ok: true };
}

export async function removeFromCart(productId: string) {
  const items = (await readCartCookie()).filter(
    (i) => i.productId !== productId
  );
  await writeCart(items);
  revalidatePath("/cart");
  return { ok: true };
}

export async function clearCart() {
  (await cookies()).delete(CART_COOKIE);
  revalidatePath("/cart");
  return { ok: true };
}
