import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { SITE, MAIN_NAV } from "@/lib/constants";

const PILLARS = [
  { label: "Digital Services", href: "/digital-services" },
  { label: "Natural Products", href: "/products" },
  { label: "Islamic Library", href: "/library" },
  { label: "Blog", href: "/blog" },
];

const COMPANY = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Login", href: "/login" },
  { label: "Create Account", href: "/register" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-brand-navy-900 text-slate-300">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-heading text-2xl font-extrabold text-white">
            <span className="text-brand-green-400">ABA</span>BIL
          </p>
          <p className="mt-2 text-sm text-slate-400">{SITE.tagline}</p>
          <p className="mt-4 max-w-xs text-sm text-slate-400">
            {SITE.description}
          </p>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Explore
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {PILLARS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-400 hover:text-brand-green-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Company
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {COMPANY.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-slate-400 hover:text-brand-green-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Get in touch
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            {SITE.email && (
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="h-4 w-4 text-brand-green-400" />
                <a href={`mailto:${SITE.email}`} className="hover:text-white">
                  {SITE.email}
                </a>
              </li>
            )}
            {SITE.phone && (
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="h-4 w-4 text-brand-green-400" />
                <a href={`tel:${SITE.phone}`} className="hover:text-white">
                  {SITE.phone}
                </a>
              </li>
            )}
            <li className="flex items-center gap-2 text-slate-400">
              <MapPin className="h-4 w-4 text-brand-green-400" />
              India
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-slate-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <nav className="flex flex-wrap items-center gap-4">
            {MAIN_NAV.slice(1).map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
