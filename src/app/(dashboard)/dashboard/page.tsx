import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag, Heart, Download, Bell, ArrowRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your ABABIL account overview.",
};

export default async function DashboardOverviewPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [orderCount, wishlistCount, downloadCount, unreadCount, recentOrders] =
    await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.wishlist.count({ where: { userId } }),
      prisma.downloadHistory.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, read: false } }),
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { items: true },
      }),
    ]);

  const stats = [
    {
      label: "Orders",
      value: orderCount,
      icon: ShoppingBag,
      href: "/dashboard/orders",
      tone: "text-brand-green-600 bg-brand-green-50",
    },
    {
      label: "Wishlist",
      value: wishlistCount,
      icon: Heart,
      href: "/dashboard/wishlist",
      tone: "text-rose-600 bg-rose-50",
    },
    {
      label: "Downloads",
      value: downloadCount,
      icon: Download,
      href: "/dashboard/downloads",
      tone: "text-blue-600 bg-blue-50",
    },
    {
      label: "Unread alerts",
      value: unreadCount,
      icon: Bell,
      href: "/dashboard/notifications",
      tone: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-navy-800">
          Welcome back, {session.user.name ?? "there"} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s a quick snapshot of your account.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="transition-shadow hover:shadow-card-hover">
                <CardBody className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.tone}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-brand-navy-800">
                      {s.value}
                    </p>
                    <p className="text-sm text-slate-500">{s.label}</p>
                  </div>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent orders */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-brand-navy-800">
            Recent orders
          </h2>
          {recentOrders.length > 0 && (
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-green-700 hover:text-brand-green-800"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders yet"
            description="When you place an order it will show up here."
            actionLabel="Browse products"
            actionHref="/products"
          />
        ) : (
          <Card>
            <ul className="divide-y divide-slate-100">
              {recentOrders.map((order) => {
                const itemCount = order.items.reduce(
                  (sum, i) => sum + i.quantity,
                  0
                );
                return (
                  <li key={order.id}>
                    <Link
                      href="/dashboard/orders"
                      className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-slate-50 md:px-6"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-brand-navy-800">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatDate(order.createdAt)} · {itemCount}{" "}
                          {itemCount === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={order.status} />
                        <span className="font-semibold text-brand-navy-800">
                          {formatPrice(Number(order.total))}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
