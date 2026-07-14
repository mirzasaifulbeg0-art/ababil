import Link from "next/link";

/**
 * Shared layout for the auth route group (login / register / forgot-password).
 * A centered card on a subtle green gradient, with the ABABIL logo linking home.
 * Server component — no interactivity of its own.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-green-50 via-white to-brand-green-50 px-4 py-12">
      {/* Decorative soft blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-green-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-green-100/50 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <Link
            href="/"
            className="font-heading text-2xl font-extrabold tracking-tight"
          >
            <span className="text-brand-green-600">ABA</span>
            <span className="text-brand-navy-800">BIL</span>
          </Link>
          <p className="mt-1 text-sm text-slate-500">
            Nature • Technology • Trust
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card md:p-8">
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link
            href="/"
            className="font-medium text-brand-green-700 transition-colors hover:text-brand-green-800"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
