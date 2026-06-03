import { cn } from "@/lib/utils";

/**
 * AmbientImage — a placed photographic "print": a framed image that bleeds
 * its own colours into the surrounding section via a blurred, scaled clone
 * rendered behind it. Optional slow Ken-Burns drift and hover zoom. Pure
 * presentational (no hooks) so it composes inside server or client trees.
 *
 * All motion is transform/opacity and disables itself under
 * prefers-reduced-motion (handled in globals.css).
 */
export interface AmbientImageProps {
  src: string;
  alt: string;
  /** Frame aspect ratio, e.g. 4/5 or 16/10. */
  ratio?: number;
  /** Ambient colour-bleed glow behind the frame. Default on. */
  glow?: boolean;
  /** Slow Ken-Burns drift on the image. */
  kenBurns?: boolean;
  /** Scale the image on hover of the frame (or its `.group` ancestor). */
  zoom?: boolean;
  /** Frame treatment. */
  frame?: "dark" | "light" | "none";
  /** Eager-load (above the fold). */
  priority?: boolean;
  /** Optional caption chip pinned to the lower edge. */
  captionAr?: string;
  captionEn?: string;
  /** Extra classes on the outer wrapper (sizing / positioning). */
  className?: string;
  /** Object-position for cinematic cropping, e.g. "50% 30%". */
  focus?: string;
}

export default function AmbientImage({
  src,
  alt,
  ratio = 4 / 5,
  glow = true,
  kenBurns = false,
  zoom = false,
  frame = "dark",
  priority = false,
  captionAr,
  captionEn,
  className,
  focus = "50% 50%",
}: AmbientImageProps) {
  const hasCaption = !!(captionAr || captionEn);
  return (
    <div className={cn("relative", className)}>
      {/* Ambient colour-bleed glow: a blurred clone picks up the photo's hues. */}
      {glow && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="img-ambient"
        />
      )}

      <div
        className={cn(
          "zoomable relative h-full w-full",
          frame === "dark" && "photo-frame",
          frame === "light" && "photo-frame photo-frame-light",
          frame === "none" && "overflow-hidden rounded-[4px]",
        )}
        style={{ aspectRatio: String(ratio) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{ objectPosition: focus }}
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            zoom && "cursor-default",
            kenBurns && "ken-burns",
          )}
        />

        {hasCaption && (
          <>
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(180deg,transparent,rgba(7,11,9,0.78))]"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 p-4 sm:p-5">
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-forest-400" />
              <span className="text-[0.66rem] font-bold uppercase leading-tight tracking-[0.18em] text-white/90">
                <span className="ar">{captionAr}</span>
                <span className="en">{captionEn}</span>
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
