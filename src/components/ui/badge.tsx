import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        green: "bg-brand-green-50 text-brand-green-700",
        navy: "bg-brand-navy-50 text-brand-navy-700",
        gray: "bg-slate-100 text-slate-600",
        amber: "bg-amber-50 text-amber-700",
        red: "bg-red-50 text-red-700",
        blue: "bg-blue-50 text-blue-700",
      },
    },
    defaultVariants: { variant: "gray" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
