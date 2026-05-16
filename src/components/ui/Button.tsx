import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Federation button. Green carries primary actions; red is the sparing
 * UAE accent; secondary is an ink outline. Motion is restrained
 * (2px lift + soft shadow), never glow.
 */
const button = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold " +
    "tracking-[0.01em] border border-transparent rounded-[2px] cursor-pointer " +
    "transition-[background-color,color,border-color,box-shadow,transform] duration-280 " +
    "ease-emphasis focus-visible:outline-none focus-visible:shadow-focus " +
    "active:scale-[0.985] active:translate-y-0 motion-reduce:transition-none " +
    "motion-reduce:active:scale-100 disabled:opacity-50 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-forest-700 text-white hover:bg-forest-600 hover:-translate-y-0.5 hover:shadow-emerald",
        red:
          "bg-scarlet-400 text-white hover:bg-scarlet-500 hover:-translate-y-0.5 hover:shadow-scarlet",
        secondary:
          "bg-transparent text-text-1 border-text-1 hover:bg-text-1 hover:text-white hover:-translate-y-0.5",
        ghost:
          "bg-transparent text-text-2 hover:text-forest-700 hover:bg-forest-50",
        light:
          "bg-transparent text-text-inverse border-white/30 hover:border-white hover:bg-white/10 hover:-translate-y-0.5",
      },
      size: {
        sm: "h-11 px-5 text-[0.8125rem]",
        md: "h-12 px-7 text-[0.9375rem]",
        lg: "h-14 px-9 text-[1.0625rem]",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(button({ variant, size, block }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { button as buttonVariants };
