"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { placeOrder } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export type CheckoutDefaults = {
  customerName: string;
  customerEmail: string;
};

/** Address + payment form that calls the placeOrder server action. */
export function CheckoutForm({ defaults }: { defaults: CheckoutDefaults }) {
  const [state, formAction, pending] = useActionState(placeOrder, undefined);

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-brand-green-100 bg-brand-green-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-100 text-brand-green-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-4 font-heading text-2xl font-bold text-brand-navy-900">
          Order confirmed!
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Thank you for your order. Your order number is:
        </p>
        <p className="mt-2 text-lg font-bold text-brand-green-700">
          {state.orderNumber}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Payments are in test mode — no real charge has been made.
        </p>
        <Button href="/dashboard/orders" variant="primary" className="mt-6">
          View my orders
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <p className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      {/* Contact */}
      <div>
        <h3 className="font-heading text-lg font-semibold text-brand-navy-800">
          Contact details
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="customerName">Full name</Label>
            <Input
              id="customerName"
              name="customerName"
              required
              defaultValue={defaults.customerName}
              placeholder="Your name"
            />
          </div>
          <div>
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              required
              defaultValue={defaults.customerEmail}
              placeholder="you@example.com"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="customerPhone">Phone</Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              required
              placeholder="Contact number"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="font-heading text-lg font-semibold text-brand-navy-800">
          Shipping address
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="addressLine1">Address line 1</Label>
            <Input
              id="addressLine1"
              name="addressLine1"
              required
              placeholder="House no., street"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="addressLine2">Address line 2 (optional)</Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              placeholder="Apartment, landmark"
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required placeholder="City" />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" name="state" required placeholder="State" />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              required
              placeholder="PIN code"
            />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div>
        <h3 className="font-heading text-lg font-semibold text-brand-navy-800">
          Payment method
        </h3>
        <div className="mt-4">
          <Label htmlFor="paymentMethod">Choose how you&apos;ll pay</Label>
          <Select
            id="paymentMethod"
            name="paymentMethod"
            defaultValue="COD"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="RAZORPAY">Razorpay</option>
          </Select>
          <p className="mt-2 text-xs text-slate-400">
            Online payments are in test mode — no real charge will be made.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={pending}
        className="w-full"
      >
        {pending ? "Placing order…" : "Place order"}
      </Button>

      <p className="text-center text-xs text-slate-400">
        By placing your order you agree to our terms. Need to change something?{" "}
        <Link href="/cart" className="text-brand-green-600 hover:underline">
          Back to cart
        </Link>
      </p>
    </form>
  );
}
