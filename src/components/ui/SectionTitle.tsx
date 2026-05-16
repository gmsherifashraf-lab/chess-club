import * as React from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

/**
 * Federation section header: optional kicker, large display title,
 * optional lede. Bilingual by the site convention (ar + en props).
 */
export interface SectionTitleProps {
  eyebrowAr?: string;
  eyebrowEn?: string;
  eyebrowTone?: "red" | "green" | "ink" | "inverse";
  titleAr: string;
  titleEn: string;
  leadAr?: string;
  leadEn?: string;
  align?: "start" | "center";
  invert?: boolean;
  as?: "h1" | "h2" | "h3";
  size?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionTitle({
  eyebrowAr,
  eyebrowEn,
  eyebrowTone = "red",
  titleAr,
  titleEn,
  leadAr,
  leadEn,
  align = "start",
  invert = false,
  as: Tag = "h2",
  size = "h2",
  className,
}: SectionTitleProps) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        centered && "items-center text-center",
        className,
      )}
    >
      {eyebrowAr && eyebrowEn && (
        <Eyebrow
          ar={eyebrowAr}
          en={eyebrowEn}
          tone={invert ? "inverse" : eyebrowTone}
        />
      )}
      <Tag
        className={cn(
          "font-disp max-w-[20ch]",
          size === "h1" && "t-h1",
          size === "h2" && "t-h2",
          size === "h3" && "t-h3",
          invert ? "text-text-inverse" : "text-text-1",
          centered && "max-w-[24ch]",
        )}
      >
        <span className="ar">{titleAr}</span>
        <span className="en">{titleEn}</span>
      </Tag>
      {leadAr && leadEn && (
        <p
          className={cn(
            "t-lead max-w-prose",
            invert ? "text-text-inverse/75" : "text-text-3",
          )}
        >
          <span className="ar">{leadAr}</span>
          <span className="en">{leadEn}</span>
        </p>
      )}
    </div>
  );
}
