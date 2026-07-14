import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Renders 5 stars, filling `value` of them. */
export function Rating({
  value,
  count,
  className,
  size = 16,
}: {
  value: number;
  count?: number;
  className?: string;
  size?: number;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={cn(
              i < Math.round(value)
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-200 text-slate-200"
            )}
          />
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-slate-500">({count})</span>
      )}
    </div>
  );
}
