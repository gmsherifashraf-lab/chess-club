import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The single horizontal rhythm primitive. Federation pages breathe:
 * generous gutters, capped measure. `size` picks the max width.
 */
const container = cva("mx-auto w-full px-5 sm:px-8 lg:px-10", {
  variants: {
    size: {
      prose: "max-w-prose",
      narrow: "max-w-wrap-sm",
      content: "max-w-wrap-md",
      default: "max-w-wrap",
      bleed: "max-w-none px-0",
    },
  },
  defaultVariants: { size: "default" },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof container> {
  as?: React.ElementType;
}

export function Container({
  className,
  size,
  as: Tag = "div",
  ...props
}: ContainerProps) {
  return <Tag className={cn(container({ size }), className)} {...props} />;
}
