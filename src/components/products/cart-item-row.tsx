"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { updateCartItem, removeFromCart } from "@/lib/actions/cart";
import { formatPrice } from "@/lib/utils";
import type { CartLine } from "@/lib/cart";

/** A single cart line with quantity controls and a remove button. */
export function CartItemRow({ line }: { line: CartLine }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setQty(quantity: number) {
    startTransition(async () => {
      await updateCartItem(line.productId, quantity);
      router.refresh();
    });
  }

  function remove() {
    startTransition(async () => {
      await removeFromCart(line.productId);
      router.refresh();
    });
  }

  const atMax = line.quantity >= line.stock;

  return (
    <div className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
      <Link
        href={`/products/${line.slug}`}
        className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50"
      >
        {line.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={line.image}
            alt={line.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">
            🍯
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${line.slug}`}
            className="font-heading font-semibold text-brand-navy-800 hover:text-brand-green-600"
          >
            {line.name}
          </Link>
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            aria-label="Remove item"
            className="text-slate-400 transition-colors hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          {formatPrice(line.price)} each
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="inline-flex items-center rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setQty(line.quantity - 1)}
              disabled={pending || line.quantity <= 1}
              aria-label="Decrease quantity"
              className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex h-9 w-10 items-center justify-center text-sm font-medium text-brand-navy-900">
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                line.quantity
              )}
            </span>
            <button
              type="button"
              onClick={() => setQty(line.quantity + 1)}
              disabled={pending || atMax}
              aria-label="Increase quantity"
              className="flex h-9 w-9 items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <span className="text-base font-bold text-brand-navy-900">
            {formatPrice(line.lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
