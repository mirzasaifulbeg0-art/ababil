"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Star, CheckCircle2, AlertCircle } from "lucide-react";
import { submitReview } from "@/lib/actions/reviews";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/** "Write a review" form. Uses the submitReview server action. */
export function ReviewForm({
  productId,
  isAuthed,
}: {
  productId: string;
  isAuthed: boolean;
}) {
  const [state, formAction, pending] = useActionState(submitReview, undefined);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);

  if (!isAuthed) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
        <p className="text-sm text-slate-600">
          Please{" "}
          <Link
            href="/login"
            className="font-medium text-brand-green-600 hover:underline"
          >
            log in
          </Link>{" "}
          to write a review.
        </p>
      </div>
    );
  }

  if (state?.ok) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-brand-green-100 bg-brand-green-50 p-4 text-sm text-brand-green-700">
        <CheckCircle2 className="h-5 w-5" />
        Thanks! Your review has been saved.
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"
    >
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <Label>Your rating</Label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            const filled = (hover || rating) >= value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                className="p-0.5"
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors",
                    filled
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-200 text-slate-200"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="comment">Your review</Label>
        <Textarea
          id="comment"
          name="comment"
          required
          minLength={3}
          maxLength={1000}
          placeholder="Share your experience with this product…"
        />
      </div>

      {state?.error && (
        <p className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="mt-4">
        {pending ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}
