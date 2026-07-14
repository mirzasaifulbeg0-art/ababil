"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";

export type OrderRowData = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string; name: string; price: number; quantity: number }[];
};

/**
 * A single order in the dashboard orders list. Click to expand the itemized
 * breakdown inline.
 */
export function OrderRow({ order }: { order: OrderRowData }) {
  const [open, setOpen] = useState(false);
  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 md:px-6"
      >
        <div className="min-w-0">
          <p className="font-medium text-brand-navy-800">{order.orderNumber}</p>
          <p className="text-xs text-slate-500">
            {formatDate(order.createdAt)} · {itemCount}{" "}
            {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <StatusBadge status={order.status} />
          <span className="font-semibold text-brand-navy-800">
            {formatPrice(order.total)}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-slate-400 transition-transform",
              open && "rotate-180"
            )}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 md:px-6">
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="text-brand-navy-800">
                  {item.name}{" "}
                  <span className="text-slate-400">× {item.quantity}</span>
                </span>
                <span className="font-medium text-slate-600">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
