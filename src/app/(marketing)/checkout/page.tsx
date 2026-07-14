import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCart } from "@/lib/cart";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { CheckoutForm } from "@/components/products/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order of natural products from ABABIL.",
};

const FREE_SHIPPING_THRESHOLD = 999;
const FLAT_SHIPPING = 49;

export default async function CheckoutPage() {
  const cart = await getCart();
  if (cart.lines.length === 0) redirect("/products");

  const session = await auth();
  const shipping =
    cart.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = cart.subtotal + shipping;

  return (
    <div className="section">
      <div className="container">
        <SectionHeading title="Checkout" align="left" />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card md:p-8">
              <CheckoutForm
                defaults={{
                  customerName: session?.user?.name ?? "",
                  customerEmail: session?.user?.email ?? "",
                }}
              />
            </div>
          </div>

          {/* Order summary */}
          <div>
            <Card className="sticky top-24">
              <CardBody>
                <CardTitle>Order summary</CardTitle>
                <ul className="mt-4 space-y-3">
                  {cart.lines.map((line) => (
                    <li key={line.productId} className="flex gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                        {line.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={line.image}
                            alt={line.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl">
                            🍯
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 items-start justify-between gap-2">
                        <div>
                          <p className="line-clamp-2 text-sm font-medium text-brand-navy-800">
                            {line.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            Qty {line.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-brand-navy-900">
                          {formatPrice(line.lineTotal)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
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
                  <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
                    <dt className="font-semibold text-brand-navy-800">Total</dt>
                    <dd className="font-bold text-brand-navy-900">
                      {formatPrice(total)}
                    </dd>
                  </div>
                </dl>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
