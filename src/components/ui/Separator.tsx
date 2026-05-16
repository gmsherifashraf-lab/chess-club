import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Professional section divider. `plain` is a hairline rule; `flag` is
 * the UAE red/white/green motif; `node` centres a small chess-square
 * mark on the rule. No side-stripe accents, no gradients-as-text.
 */
const separator = cva("w-full border-0", {
  variants: {
    variant: {
      plain: "h-px bg-line",
      soft: "h-px bg-line-soft",
      flag: "h-[3px] bg-[linear-gradient(90deg,#C8102E_33.3%,#fff_33.3%_66.6%,#117A4F_66.6%)]",
      strong: "h-0.5 bg-text-1/15",
    },
  },
  defaultVariants: { variant: "plain" },
});

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separator> {
  node?: boolean;
}

export function Separator({ className, variant, node, ...props }: SeparatorProps) {
  if (node) {
    return (
      <div
        className={cn("flex items-center gap-5 text-line-strong", className)}
        role="separator"
        {...props}
      >
        <span className="h-px flex-1 bg-line" />
        <span
          aria-hidden
          className="h-2.5 w-2.5 rotate-45 border border-forest-700/40"
        />
        <span className="h-px flex-1 bg-line" />
      </div>
    );
  }
  return (
    <div
      role="separator"
      className={cn(separator({ variant }), className)}
      {...props}
    />
  );
}
