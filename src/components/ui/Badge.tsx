import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-[2px] border px-3 py-1 " +
    "text-[0.75rem] font-semibold uppercase tracking-[0.04em] whitespace-nowrap",
  {
    variants: {
      tone: {
        red: "bg-scarlet-400/[0.07] text-scarlet-500 border-scarlet-400/20",
        green: "bg-forest-700/[0.07] text-forest-700 border-forest-700/20",
        ink: "bg-text-1/[0.05] text-text-2 border-text-1/15",
        inverse: "bg-white/10 text-text-inverse border-white/25",
      },
    },
    defaultVariants: { tone: "green" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...props} />;
}

export { badge as badgeVariants };
