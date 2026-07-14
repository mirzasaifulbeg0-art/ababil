"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toggleWishlist } from "@/lib/actions/wishlist";
import { Button } from "@/components/ui/button";

/**
 * Removes a product from the user's wishlist. Calls `toggleWishlist` (which
 * removes it when already present) then refreshes the route to update the list.
 */
export function WishlistRemove({ productId }: { productId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      await toggleWishlist(productId);
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleRemove}
      disabled={pending}
      aria-label="Remove from wishlist"
      className="text-red-600 hover:bg-red-50"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">Remove</span>
    </Button>
  );
}
