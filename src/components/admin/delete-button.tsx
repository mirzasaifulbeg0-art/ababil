"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Reusable delete control. Pass a bound server action, e.g.
 * `deleteProduct.bind(null, id)`. Confirms, runs the action, then refreshes.
 */
export function DeleteButton({
  onDelete,
  label = "Delete",
  confirmMessage = "Are you sure you want to delete this? This cannot be undone.",
}: {
  onDelete: () => Promise<{ ok: boolean; error?: string }>;
  label?: string;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    setError(null);
    startTransition(async () => {
      const res = await onDelete();
      if (res?.ok) {
        router.refresh();
      } else {
        setError(res?.error ?? "Failed to delete");
      }
    });
  }

  return (
    <div className="inline-flex flex-col items-end">
      <Button
        type="button"
        variant="danger"
        size="sm"
        onClick={handleClick}
        disabled={pending}
      >
        <Trash2 className="h-4 w-4" />
        {pending ? "Deleting…" : label}
      </Button>
      {error && <span className="mt-1 text-xs text-red-600">{error}</span>}
    </div>
  );
}
