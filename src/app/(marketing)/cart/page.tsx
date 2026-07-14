import type { Metadata } from "next";
import { ShoppingCart } from "lucide-react";
import { getCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { CartItemRow } from "@/components/products/cart-item-row";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review the natural products in your cart before checkout.",
};

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING = 49;

export default async function CartPage() {
  const cart = await getCart();

  if (cart.lines.length === 0) {
    return (
      <div className="section">
        <div className="container">
          <SectionHeading title="Your cart" align="left" />
          <div className="mt-8">
            <EmptyState
              icon={ShoppingCart}
              title="Your cart is empty"
              description="Browse our natural products and add something you love."
              actionLabel="Shop products"
              actionHref="/products"
            />
          </div>
        </div>
      </div>
    );
  }

  const shipping =
    cart.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = cart.subtotal + shipping;

  return (
    <div className="section">
      <div className="container">
        <SectionHeading
          title="Your cart"
          subtitle={`${cart.itemCount} item${cart.itemCount > 1 ? "s" : ""} in your cart`}
          align="left"
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Line items */}
          <div className="space-y-4 lg:col-span-2">
            {cart.lines.map((line) => (
              <CartItemRow key={line.productId} line={line} />
            ))}
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-24">
              <CardBody>
                <CardTitle>Order summary</CardTitle>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Subtotal</dt>
                    <dd className="font-medium text-brand-navy-900">
                      {formatPrice(cart.subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Shipping</dt>
                    <dd className="font-medium text-brand-navy-900">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </dd>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-slate-400">
                      Free shipping on orders over{" "}
                      {formatPrice(FREE_SHIPPING_THRESHOLD)}.
                    </p>
                  )}
                  <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
                    <dt className="font-semibold text-brand-navy-800">Total</dt>
                    <dd className="font-bold text-brand-navy-900">
                      {formatPrice(total)}
                    </dd>
                  </div>
                </dl>

                <Button
                  href="/checkout"
                  variant="primary"
                  size="lg"
                  className="mt-6 w-full"
                >
                  Proceed to checkout
                </Button>
                <Button
                  href="/products"
                  variant="ghost"
                  className="mt-2 w-full"
                >
                  Continue shopping
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
