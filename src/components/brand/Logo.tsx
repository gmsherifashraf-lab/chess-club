import Image from "next/image";

/**
 * Logo — the official club emblem: the UAE-crowned chess-queen mark.
 *
 * Single source of truth for the club mark. The bilingual club name is
 * set as text beside the emblem in the navbar and footer lockups. The
 * artwork is shown in its authentic colours on light surfaces and as the
 * official white mark on dark / photographic surfaces — never recoloured.
 */
const EMBLEM = {
  colour: "/logo/emblem-mark.png",
  white: "/logo/emblem-mark-white.png",
  w: 348,
  h: 910,
};
const ASPECT = EMBLEM.w / EMBLEM.h;

interface Props {
  /** Rendered height of the emblem, in px. Width follows the mark ratio. */
  size?: number;
  /** Surface the emblem sits on — selects the colour or white artwork. */
  surface?: "light" | "dark";
  /** Soft fade + scale entrance on mount. */
  animate?: boolean;
  /** Mark as a priority image (above-the-fold: navbar, hero, splash). */
  priority?: boolean;
  /** Classes appended to the image. */
  className?: string;
}

export default function Logo({
  size = 60,
  surface = "light",
  animate = false,
  priority = false,
  className = "",
}: Props) {
  const height = size;
  const width = Math.round(height * ASPECT);

  return (
    <Image
      src={surface === "dark" ? EMBLEM.white : EMBLEM.colour}
      alt="Chess & Culture Club for Women, Sharjah — emblem"
      width={EMBLEM.w}
      height={EMBLEM.h}
      priority={priority}
      // The emblem carries fine detail — serve the master PNG as-is so the
      // browser down-scales it crisply at any density.
      unoptimized
      className={`${animate ? "logo-mount" : ""} ${className}`.trim()}
      style={{ height, width, objectFit: "contain", display: "block" }}
    />
  );
}
