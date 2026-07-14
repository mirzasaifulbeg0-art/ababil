import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/shared/rating";
import { AddToCartButton } from "@/components/products/add-to-cart-button";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  image: string | null;
  rating?: number;
  reviewCount?: number;
};

/** Product tile used on the shop grid and homepage. */
export function ProductCard({ product }: { product: ProductCardData }) {
  const outOfStock = product.stock <= 0;
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100
        )
      : null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-50">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl">
            🍯
          </div>
        )}
        {discount && (
          <span className="absolute left-3 top-3">
            <Badge variant="red">-{discount}%</Badge>
          </span>
        )}
        {outOfStock && (
          <span className="absolute right-3 top-3">
            <Badge variant="gray">Out of stock</Badge>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-2 font-heading font-semibold text-brand-navy-800 hover:text-brand-green-600">
            {product.name}
          </h3>
        </Link>
        {typeof product.rating === "number" && (
          <div className="mt-1">
            <Rating value={product.rating} count={product.reviewCount} />
          </div>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-brand-navy-900">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        <div className="mt-auto pt-4">
          <AddToCartButton
            productId={product.id}
            disabled={outOfStock}
            size="sm"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
