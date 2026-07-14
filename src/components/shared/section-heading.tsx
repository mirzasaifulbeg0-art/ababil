import { cn } from "@/lib/utils";

/** Consistent heading block for marketing sections. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-block rounded-full bg-brand-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-green-700">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-3xl md:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-base text-slate-600 md:text-lg">{subtitle}</p>
      )}
    </div>
  );
}
