import Link from "next/link";
import {
  Package,
  Wrench,
  ShoppingBag,
  Clock,
  ClipboardList,
  BookOpen,
  Newspaper,
  Mail,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata = {
  title: "Dashboard — ABABIL Admin",
  description: "Overview of ABABIL store activity.",
};

export default async function AdminDashboardPage() {
  const [
    products,
    activeServices,
    orders,
    pendingOrders,
    serviceRequests,
    books,
    publishedBlogs,
    unreadMessages,
    customers,
    recentOrders,
    recentRequests,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.digitalService.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.serviceRequest.count(),
    prisma.islamicBook.count(),
    prisma.blog.count({ where: { published: true } }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.serviceRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { service: true },
    }),
  ]);

  const stats = [
    { label: "Products", value: products, icon: Package, href: "/admin/products" },
    { label: "Active services", value: activeServices, icon: Wrench, href: "/admin/services" },
    { label: "Orders", value: orders, icon: ShoppingBag, href: "/admin/orders" },
    { label: "Pending orders", value: pendingOrders, icon: Clock, href: "/admin/orders" },
    { label: "Service requests", value: serviceRequests, icon: ClipboardList, href: "/admin/services/requests" },
    { label: "Books", value: books, icon: BookOpen, href: "/admin/books" },
    { label: "Published blogs", value: publishedBlogs, icon: Newspaper, href: "/admin/blogs" },
    { label: "Unread messages", value: unreadMessages, icon: Mail, href: "/admin/messages" },
    { label: "Customers", value: customers, icon: Users, href: "/admin/customers" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-navy-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          A quick overview of your store.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Card className="transition-shadow hover:shadow-card-hover">
              <CardBody className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-50 text-brand-green-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-navy-900">
                    {value}
                  </div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardBody>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-brand-navy-800">
                Recent orders
              </h2>
              <Link
                href="/admin/orders"
                className="text-sm font-medium text-brand-green-600 hover:underline"
              >
                View all
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No orders yet.
              </p>
            ) : (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td className="py-2.5">
                        <Link
                          href="/admin/orders"
                          className="font-medium text-brand-navy-800 hover:text-brand-green-600"
                        >
                          {o.orderNumber}
                        </Link>
                        <div className="text-xs text-slate-500">
                          {o.customerName}
                        </div>
                      </td>
                      <td className="py-2.5 text-right text-slate-600">
                        {formatPrice(Number(o.total))}
                      </td>
                      <td className="py-2.5 text-right">
                        <StatusBadge status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-brand-navy-800">
                Recent service requests
              </h2>
              <Link
                href="/admin/services/requests"
                className="text-sm font-medium text-brand-green-600 hover:underline"
              >
                View all
              </Link>
            </div>
            {recentRequests.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                No service requests yet.
              </p>
            ) : (
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  {recentRequests.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2.5">
                        <div className="font-medium text-brand-navy-800">
                          {r.fullName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {r.service.name}
                        </div>
                      </td>
                      <td className="py-2.5 text-right text-xs text-slate-500">
                        {formatDate(r.createdAt)}
                      </td>
                      <td className="py-2.5 text-right">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
