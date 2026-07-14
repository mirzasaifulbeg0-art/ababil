"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getCart, CART_COOKIE } from "@/lib/cart";
import { checkoutSchema } from "@/lib/validations";

export type CheckoutResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING = 49;

/** Turn the current cart into a real order. Test-mode: COD marks as pending. */
export async function placeOrder(
  _prev: CheckoutResult | undefined,
  formData: FormData
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2"),
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    paymentMethod: formData.get("paymentMethod"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const cart = await getCart();
  if (cart.lines.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const session = await auth();
  const subtotal = cart.subtotal;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;
  const d = parsed.data;

  // Human-friendly order number: ABABIL-<timestamp36>-<rand>
  const orderNumber = `ABABIL-${Date.now().toString(36).toUpperCase()}${Math.floor(
    Math.random() * 900 + 100
  )}`;

  try {
    await prisma.$transaction(async (tx) => {
      // Re-check stock inside the transaction to avoid overselling.
      for (const line of cart.lines) {
        const product = await tx.product.findUnique({
          where: { id: line.productId },
          select: { stock: true, name: true },
        });
        if (!product || product.stock < line.quantity) {
          throw new Error(`"${line.name}" is out of stock.`);
        }
      }

      await tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id ?? null,
          status: "PENDING",
          paymentStatus: "PENDING",
          paymentMethod: d.paymentMethod,
          subtotal,
          shipping,
          total,
          customerName: d.customerName,
          customerEmail: d.customerEmail,
          customerPhone: d.customerPhone,
          addressLine1: d.addressLine1,
          addressLine2: d.addressLine2 || null,
          city: d.city,
          state: d.state,
          postalCode: d.postalCode,
          items: {
            create: cart.lines.map((l) => ({
              productId: l.productId,
              name: l.name,
              price: l.price,
              quantity: l.quantity,
            })),
          },
        },
      });

      // Decrement stock.
      for (const line of cart.lines) {
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.quantity } },
        });
      }
    });
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not place the order.",
    };
  }

  // Empty the cart.
  (await cookies()).delete(CART_COOKIE);
  revalidatePath("/cart");
  revalidatePath("/dashboard/orders");

  return { ok: true, orderNumber };
}
