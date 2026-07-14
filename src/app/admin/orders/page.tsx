import { ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { updateOrderStatus } from "@/lib/actions/admin";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata = {
  title: "Orders — ABABIL Admin",
  description: "Manage product orders.",
};

const STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, user: true },
  });

  async function updateStatus(formData: FormData) {
    "use server";
    await updateOrderStatus(formData);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
          Orders
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {orders.length} order{orders.length === 1 ? "" : "s"}
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Customer orders will appear here."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <div className="font-medium text-brand-navy-800">
                        {o.orderNumber}
                      </div>
                      <div className="text-xs text-slate-500">
                        {o.items.length} item{o.items.length === 1 ? "" : "s"}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-slate-700">{o.customerName}</div>
                      <div className="text-xs text-slate-500">
                        {o.customerEmail}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {formatPrice(Number(o.total))}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3">
                      <form
                        action={updateStatus}
                        className="flex items-center gap-2"
                      >
                        <input type="hidden" name="orderId" value={o.id} />
                        <Select
                          name="status"
                          defaultValue={o.status}
                          className="h-9 w-36"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0) + s.slice(1).toLowerCase()}
                            </option>
                          ))}
                        </Select>
                        <Button type="submit" size="sm" variant="outline">
                          Update
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
