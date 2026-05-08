"use client";

export const CLUB_SOCIAL = {
  instagram: {
    url:    "https://www.instagram.com/shjladieschess/",
    handle: "@shjladieschess",
  },
  facebook: {
    url:    "https://www.facebook.com/shjladieschessclub/",
    handle: "Sharjah Ladies Chess Club",
  },
};

interface IconProps {
  size?: number;
  className?: string;
}

export function InstagramIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden>
      <path d="M13.5 21.95V13.5h2.85l.43-3.32H13.5V8.06c0-.96.27-1.62 1.65-1.62h1.76V3.47c-.3-.04-1.34-.13-2.55-.13-2.52 0-4.25 1.54-4.25 4.36v2.43H7.18v3.32h2.93v8.5h3.39z" />
    </svg>
  );
}

interface SocialRowProps {
  variant?: "light" | "dark" | "transparent";
  size?: number;
  showLabels?: boolean;
}

/**
 * Inline social icons row used in the navbar + footer.
 * "light" = on dark backgrounds (default — white icons, emerald hover)
 * "dark"  = on light backgrounds (ink icons, scarlet hover)
 */
export function SocialRow({ variant = "light", size = 18, showLabels = false }: SocialRowProps) {
  const baseClasses =
    variant === "dark"
      ? "text-ink/70 hover:text-[#C8102E] hover:border-[#C8102E] border-stone"
      : "text-white/70 hover:text-white hover:border-[#1F6B4F] border-white/15";

  return (
    <div className="flex items-center gap-2.5">
      <a
        href={CLUB_SOCIAL.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram — @shjladieschess"
        className={`group relative inline-flex items-center justify-center w-10 h-10 border ${baseClasses} transition-all duration-300 hover:-translate-y-0.5`}
      >
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "radial-gradient(circle at center, rgba(31,107,79,0.25) 0%, transparent 70%)" }} />
        <InstagramIcon size={size} className="relative" />
      </a>
      <a
        href={CLUB_SOCIAL.facebook.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook — Sharjah Ladies Chess Club"
        className={`group relative inline-flex items-center justify-center w-10 h-10 border ${baseClasses} transition-all duration-300 hover:-translate-y-0.5`}
      >
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "radial-gradient(circle at center, rgba(31,107,79,0.25) 0%, transparent 70%)" }} />
        <FacebookIcon size={size} className="relative" />
      </a>
      {showLabels && (
        <div className="ml-1 text-[0.62rem] uppercase tracking-[0.22em] font-semibold opacity-50">
          {CLUB_SOCIAL.instagram.handle}
        </div>
      )}
    </div>
  );
}
