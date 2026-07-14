import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The single button style used across ABABIL. Use `variant` and `size` to pick
 * a look. Pass `href` to render a Next.js <Link> that looks like a button.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-green-500 text-white shadow-card hover:bg-brand-green-600 hover:shadow-card-hover",
        navy: "bg-brand-navy-800 text-white shadow-card hover:bg-brand-navy-900",
        outline:
          "border border-slate-200 bg-white text-brand-navy-800 hover:border-brand-green-300 hover:bg-brand-green-50",
        ghost: "text-brand-navy-800 hover:bg-slate-100",
        danger: "bg-red-600 text-white hover:bg-red-700",
        subtle: "bg-brand-green-50 text-brand-green-700 hover:bg-brand-green-100",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);
    if (href) {
      return (
        <Link href={href} className={classes}>
          {props.children}
        </Link>
      );
    }
    return <button ref={ref} className={classes} {...props} />;
  }
);
Button.displayName = "Button";

export { buttonVariants };
