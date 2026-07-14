"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import { registerDownload } from "@/lib/actions/downloads";
import { Button } from "@/components/ui/button";

export function DownloadButton({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDownload() {
    setError(null);
    startTransition(async () => {
      const result = await registerDownload(bookId);
      if (result.ok) {
        window.open(result.url, "_blank");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <Button
        type="button"
        onClick={handleDownload}
        disabled={pending}
        size="lg"
        className="w-full sm:w-auto"
      >
        {pending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Download className="h-5 w-5" />
        )}
        {pending ? "Preparing…" : "Download PDF"}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
