import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Kicker label above section titles. Bilingual by the site convention:
 * pass `ar` + `en`; CSS shows the one matching <html dir>.
 * A single short kicker is voice; do not stack it everywhere.
 */
const eyebrow = cva(
  "inline-flex items-center gap-3 text-eyebrow font-semibold uppercase",
  {
    variants: {
      tone: {
        red: "text-scarlet-500",
        green: "text-forest-700",
        ink: "text-text-3",
        inverse: "text-text-inverse/70",
      },
      rule: { true: "before:h-0.5 before:w-8 before:bg-current before:content-['']", false: "" },
    },
    defaultVariants: { tone: "red", rule: true },
  },
);

export interface EyebrowProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof eyebrow> {
  ar: string;
  en: string;
}

export function Eyebrow({ className, tone, rule, ar, en, ...props }: EyebrowProps) {
  return (
    <span className={cn(eyebrow({ tone, rule }), className)} {...props}>
      <span className="ar">{ar}</span>
      <span className="en">{en}</span>
    </span>
  );
}
