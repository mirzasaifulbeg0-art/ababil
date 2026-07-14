"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { addToCart } from "@/lib/actions/cart";
import { Button, type ButtonProps } from "@/components/ui/button";

/** Adds a product to the cookie cart, then refreshes so the navbar updates. */
export function AddToCartButton({
  productId,
  quantity = 1,
  disabled,
  label = "Add to Cart",
  variant = "primary",
  size = "md",
  className,
}: {
  productId: string;
  quantity?: number;
  disabled?: boolean;
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleClick() {
    startTransition(async () => {
      const res = await addToCart(productId, quantity);
      if (res.ok) {
        setDone(true);
        router.refresh();
        setTimeout(() => setDone(false), 1500);
      }
    });
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={disabled || pending}
      variant={variant}
      size={size}
      className={className}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : done ? (
        <Check className="h-4 w-4" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {done ? "Added" : label}
    </Button>
  );
}
