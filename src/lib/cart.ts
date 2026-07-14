import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Cookie-based shopping cart.
 *
 * We keep the cart in a signed-free JSON cookie so it works for guests AND
 * logged-in users without extra tables. Prices/stock are always re-read from
 * the database (never trusted from the cookie) so totals are always live.
 */
export const CART_COOKIE = "ababil_cart";

export type CartCookieItem = { productId: string; quantity: number };

export type CartLine = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  stock: number;
  image: string | null;
  lineTotal: number;
};

export type Cart = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
};

/** Parse the raw cookie into a list of {productId, quantity}. */
export async function readCartCookie(): Promise<CartCookieItem[]> {
  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (i) =>
          i &&
          typeof i.productId === "string" &&
          Number.isFinite(i.quantity) &&
          i.quantity > 0
      )
      .map((i) => ({ productId: i.productId, quantity: Math.floor(i.quantity) }));
  } catch {
    return [];
  }
}

/** Full cart with live product data joined from the DB. */
export async function getCart(): Promise<Cart> {
  const items = await readCartCookie();
  if (items.length === 0) return { lines: [], itemCount: 0, subtotal: 0 };

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, isActive: true },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });

  const lines: CartLine[] = [];
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;
    const quantity = Math.min(item.quantity, Math.max(product.stock, 0));
    if (quantity <= 0) continue;
    const price = Number(product.price);
    lines.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price,
      quantity,
      stock: product.stock,
      image: product.images[0]?.url ?? null,
      lineTotal: price * quantity,
    });
  }

  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  return { lines, itemCount, subtotal };
}

/** Cheap count for the navbar badge (no product join needed). */
export async function getCartCount(): Promise<number> {
  const items = await readCartCookie();
  return items.reduce((n, i) => n + i.quantity, 0);
}
