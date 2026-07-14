import Link from "next/link";

/** Shown automatically whenever a page/route is not found (HTTP 404). */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-heading text-6xl font-extrabold text-brand-green-600">
        404
      </p>
      <h1 className="mt-4 text-2xl">Page not found</h1>
      <p className="mt-2 max-w-md text-slate-600">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-brand-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-green-700"
      >
        Back to home
      </Link>
    </div>
  );
}
