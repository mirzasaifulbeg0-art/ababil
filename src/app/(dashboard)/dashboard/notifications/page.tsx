import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { MarkReadButton } from "@/components/dashboard/mark-read-button";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your latest ABABIL account notifications.",
};

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-navy-800">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Order updates and account alerts.
          </p>
        </div>
        {hasUnread && <MarkReadButton />}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up. New alerts will appear here."
        />
      ) : (
        <Card>
          <ul className="divide-y divide-slate-100">
            {notifications.map((n) => {
              const body = (
                <div className="flex items-start gap-3 px-5 py-4 md:px-6">
                  <span
                    className={cn(
                      "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                      n.read ? "bg-slate-200" : "bg-brand-green-500"
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm",
                        n.read
                          ? "font-medium text-slate-600"
                          : "font-semibold text-brand-navy-800"
                      )}
                    >
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">{n.message}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(n.createdAt)}
                    </p>
                  </div>
                </div>
              );

              return (
                <li
                  key={n.id}
                  className={cn(!n.read && "bg-brand-green-50/40")}
                >
                  {n.link ? (
                    <Link
                      href={n.link}
                      className="block transition-colors hover:bg-slate-50"
                    >
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
