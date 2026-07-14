import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { WishlistRemove } from "@/components/dashboard/wishlist-remove";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "Products you've saved for later on ABABIL.",
};

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const items = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: { images: { orderBy: { position: "asc" }, take: 1 } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-brand-navy-800">
          My wishlist
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Products you&apos;ve saved for later.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here."
          actionLabel="Browse products"
          actionHref="/products"
        />
      ) : (
        <Card>
          <ul className="divide-y divide-slate-100">
            {items.map(({ product }) => {
              const image = product.images[0];
              return (
                <li
                  key={product.id}
                  className="flex items-center gap-4 px-5 py-4 md:px-6"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
                  >
                    {image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={image.url}
                        alt={image.alt ?? product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <Heart className="h-6 w-6" />
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${product.slug}`}
                      className="block truncate font-medium text-brand-navy-800 hover:text-brand-green-700"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-0.5 text-sm font-semibold text-brand-green-700">
                      {formatPrice(Number(product.price))}
                    </p>
                  </div>

                  <WishlistRemove productId={product.id} />
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
