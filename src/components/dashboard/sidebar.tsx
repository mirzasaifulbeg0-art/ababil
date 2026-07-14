"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutGrid,
  ShoppingBag,
  Download,
  Heart,
  Bell,
  User,
  LogOut,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Downloads", href: "/dashboard/downloads", icon: Download },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Profile", href: "/dashboard/profile", icon: User },
] as const;

/**
 * Dashboard sidebar navigation. Highlights the active route with usePathname
 * and provides a sign-out control. Rendered on both desktop (fixed rail) and
 * as a horizontal scroller on small screens.
 */
export function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand-green-50 text-brand-green-700"
                : "text-slate-600 hover:bg-slate-100 hover:text-brand-navy-800"
            )}
          >
            <Icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        );
      })}

      <div className="my-2 border-t border-slate-100" />

      <Link
        href="/"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-navy-800"
      >
        <Home className="h-[18px] w-[18px]" />
        Back to site
      </Link>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Sign out
      </button>
    </nav>
  );
}
