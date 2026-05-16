import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * One card system for the whole site. Never nest cards.
 * `accent` adds a 3px federation top rule; `interactive` enables the
 * restrained hover lift.
 */
const card = cva(
  "relative rounded-[3px] border transition-[transform,box-shadow,border-color] " +
    "duration-280 ease-emphasis",
  {
    variants: {
      variant: {
        default: "bg-white border-line shadow-card",
        elevated: "bg-white border-line shadow-feature",
        flat: "bg-cream-100 border-line",
        dark: "bg-onyx-300 border-white/10 shadow-dark text-text-inverse",
      },
      accent: {
        none: "",
        red: "border-t-[3px] border-t-scarlet-400",
        green: "border-t-[3px] border-t-forest-700",
        ink: "border-t-[3px] border-t-text-1",
      },
      interactive: {
        true: "hover:-translate-y-1 hover:shadow-card-hover hover:border-line-strong",
        false: "",
      },
    },
    defaultVariants: { variant: "default", accent: "none", interactive: false },
  },
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof card> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, accent, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(card({ variant, accent, interactive }), className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const CardBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-7 sm:p-9", className)} {...props} />
));
CardBody.displayName = "CardBody";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-disp t-h4 text-current", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export { card as cardVariants };
