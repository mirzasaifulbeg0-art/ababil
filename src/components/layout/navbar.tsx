"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, LayoutDashboard, LogIn } from "lucide-react";
import { MAIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Public site header. Sticky, responsive, with a slide-down mobile menu.
 * `isAuthed` decides whether we show "Dashboard" or "Login".
 */
export function Navbar({
  isAuthed,
  cartCount = 0,
}: {
  isAuthed: boolean;
  cartCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-heading text-xl font-extrabold"
          onClick={() => setOpen(false)}
        >
          <span className="text-brand-green-600">ABA</span>
          <span className="text-brand-navy-800">BIL</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-brand-green-600",
                isActive(item.href)
                  ? "text-brand-green-600"
                  : "text-slate-600"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-brand-navy-800 hover:bg-slate-100"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-green-500 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthed ? (
            <Button href="/dashboard" variant="outline" size="sm" className="hidden sm:inline-flex">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Button>
          ) : (
            <Button href="/login" variant="primary" size="sm" className="hidden sm:inline-flex">
              <LogIn className="h-4 w-4" /> Login
            </Button>
          )}

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl text-brand-navy-800 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <nav className="container flex flex-col py-3">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium",
                  isActive(item.href)
                    ? "bg-brand-green-50 text-brand-green-700"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-slate-100 pt-3">
              {isAuthed ? (
                <Button href="/dashboard" variant="outline" size="sm" className="w-full">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Button>
              ) : (
                <Button href="/login" variant="primary" size="sm" className="w-full">
                  <LogIn className="h-4 w-4" /> Login
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
