import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderRow } from "@/components/dashboard/order-row";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Track and review your ABABIL orders.",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-navy-800">
          My orders
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {orders.length > 0
            ? "Tap an order to view its items."
            : "Your order history will appear here."}
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="Once you place an order, you'll be able to track it here."
          actionLabel="Browse products"
          actionHref="/products"
        />
      ) : (
        <Card>
          <ul className="divide-y divide-slate-100">
            {orders.map((order) => (
              <OrderRow
                key={order.id}
                order={{
                  id: order.id,
                  orderNumber: order.orderNumber,
                  status: order.status,
                  total: Number(order.total),
                  createdAt: order.createdAt.toISOString(),
                  items: order.items.map((i) => ({
                    id: i.id,
                    name: i.name,
                    price: Number(i.price),
                    quantity: i.quantity,
                  })),
                }}
              />
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
