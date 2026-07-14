import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Friendly placeholder shown when a list has no items yet. */
export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-50 text-brand-green-600">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 font-heading text-lg font-semibold text-brand-navy-800">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Button href={actionHref} className="mt-6" variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
