import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SignOutButton } from "@/components/dashboard/signout-button";

/**
 * Dashboard shell. This route group has no marketing header, so we render a
 * minimal top nav (ABABIL logo + user name + sign out) and a sidebar. Protected
 * by middleware, but we still guard here defensively.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const name = session.user.name ?? "Account";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="font-heading text-xl font-extrabold tracking-tight"
          >
            <span className="text-brand-green-600">ABA</span>
            <span className="text-brand-navy-800">BIL</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:inline">
              Hi,{" "}
              <span className="font-medium text-brand-navy-800">{name}</span>
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="container grid gap-6 py-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-card">
            <DashboardSidebar />
          </div>
        </aside>

        {/* Page content */}
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
