import type { Config } from "tailwindcss";

/**
 * Design system tokens — single source of truth for color, type,
 * spacing, shadow, motion, and shape across the entire club site.
 *
 * Tokens here are mirrored as CSS custom properties in `globals.css`
 * (`:root` block) so runtime styles (inline, CSS-in-JS, Framer
 * animations) can read the same values without drift.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // ────────────────────────────────────────────────────────────────
      //  COLOR
      //  Editorial luxury palette: deep emerald primary, scarlet accent,
      //  warm cream surfaces, ink near-black, restrained gold for honour.
      //  Legacy aliases preserved (ivory/ivory2/stone, ink/ink2/ink3) so
      //  existing dashboard pages and admin tooling don't break.
      // ────────────────────────────────────────────────────────────────
      colors: {
        // Legacy aliases (kept)
        ivory:   "#F8F5F0",
        ivory2:  "#EDE9E2",
        stone:   "#D6D0C4",
        ink:     "#000000",
        ink2:    "#0A0A0A",
        ink3:    "#1A1A1A",
        emerald: "#0B3D2E",
        emerald2:"#1F6B4F",
        emerald3:"#0E5236",
        red:     "#C8102E",
        "red-dk":"#9D0C24",
        white:   "#FFFFFF",
        green:   "#0B3D2E",
        green2:  "#1F6B4F",
        gold:    "#A07820",

        // ── New semantic / scaled palette ──
        // Cream — warm light surface scale
        cream: {
          50:  "#FFFFFF",
          100: "#FBF8F3",
          200: "#F8F5F0", // = ivory
          300: "#F1ECE2",
          400: "#EDE9E2", // = ivory2
          500: "#E5DFD2",
          600: "#D6D0C4", // = stone
          700: "#BFB6A3",
          800: "#9C9381",
        },
        // Onyx — refined dark tones for text & dark surfaces
        onyx: {
          50:  "#3a3a3a",
          100: "#2a2a2a",
          200: "#1f1f1f",
          300: "#161616",
          400: "#0E0E0E",
          500: "#080808",
          600: "#020202",
        },
        // Text scale — semantic
        text: {
          DEFAULT: "#141414",
          1:       "#141414",
          2:       "#3A3A3A",
          3:       "#646464",
          4:       "#8A8579",
          inverse: "#F8F5F0",
        },
        // Border scale — semantic
        line: {
          DEFAULT: "#E5DFD2",
          soft:    "rgba(20,20,20,0.06)",
          mid:     "#D6D0C4",
          strong:  "#BFB6A3",
          dark:    "rgba(255,255,255,0.10)",
        },
        // Brand emerald scale
        forest: {
          50:  "#E8F1ED",
          100: "#C8DDD0",
          200: "#92BBA1",
          300: "#5C9974",
          400: "#3FAA62",
          500: "#1F6B4F", // = emerald2
          600: "#0E5236", // = emerald3
          700: "#0B3D2E", // = emerald (primary)
          800: "#073023",
          900: "#04201A",
        },
        // Brand scarlet scale
        scarlet: {
          50:  "#FCE9EC",
          100: "#F5C2C9",
          200: "#EB8794",
          300: "#E0364C",
          400: "#C8102E", // = red
          500: "#9D0C24", // = red-dk
          600: "#7E0B22",
          700: "#5C081A",
        },
        // Honour gold (used sparingly for medals / accolades)
        honor: {
          200: "#EBD394",
          300: "#D9B65A",
          400: "#A07820", // = gold
          500: "#8E661A",
          600: "#56400F",
        },
      },

      // ────────────────────────────────────────────────────────────────
      //  TYPOGRAPHY
      // ────────────────────────────────────────────────────────────────
      fontFamily: {
        // Existing aliases (kept)
        "noto-ar":  ['"Noto Sans Arabic"', "sans-serif"],
        "noto-ser": ['"Noto Serif Arabic"', "serif"],
        "playfair": ['"Playfair Display"', "Georgia", "serif"],
        "dm":       ['"DM Sans"', "sans-serif"],
        // Semantic aliases that resolve to the next/font CSS vars set
        // in src/app/layout.tsx
        disp: ['var(--font-playfair)', "Georgia", "serif"],
        body: ['var(--font-inter)',    "system-ui", "sans-serif"],
        ar:   ['var(--font-cairo)',    '"Noto Sans Arabic"', "sans-serif"],
      },
      fontSize: {
        "micro":   ["0.6rem",   { lineHeight: "1.4",  letterSpacing: "0.22em" }],
        "eyebrow": ["0.66rem",  { lineHeight: "1.4",  letterSpacing: "0.28em" }],
        "caption": ["0.78rem",  { lineHeight: "1.5",  letterSpacing: "0.01em" }],
      },
      letterSpacing: {
        "tightest": "-0.04em",
        "tighter":  "-0.025em",
        "tight-1":  "-0.015em",
        "loose-1":  "0.04em",
        "loose-2":  "0.18em",
        "loose-3":  "0.22em",
        "loose-4":  "0.28em",
        "loose-5":  "0.32em",
      },
      lineHeight: {
        "snug-1":  "1.06",
        "tight-1": "0.94",
        "tight-2": "0.98",
        "tight-3": "1.04",
      },

      // ────────────────────────────────────────────────────────────────
      //  LAYOUT
      // ────────────────────────────────────────────────────────────────
      maxWidth: {
        wrap:      "1320px",
        "wrap-md": "1040px",
        "wrap-sm": "780px",
        "wrap-xs": "640px",
        prose:     "68ch",
      },
      spacing: {
        "18":  "4.5rem",
        "22":  "5.5rem",
        "26":  "6.5rem",
        "30":  "7.5rem",
        "34":  "8.5rem",
      },

      // ────────────────────────────────────────────────────────────────
      //  SHAPE
      //  Sharp corners are intentional (editorial). Use 1–4px only for
      //  small UI atoms (controls, chips). Pills for tag/dot atoms only.
      // ────────────────────────────────────────────────────────────────
      borderRadius: {
        "1": "1px",
        "2": "2px",
        "3": "3px",
        "4": "4px",
      },
      borderWidth: {
        "1.5": "1.5px",
        "3":   "3px",
      },

      // ────────────────────────────────────────────────────────────────
      //  ELEVATION — multi-layer, light-source biased toward upper-left.
      //  Each level pairs a hairline (1-2px tight) + diffuse mid-cast
      //  ambient + a brand-tinted long throw. Tinted variants fold the
      //  brand emerald or scarlet into the long throw for cohesion.
      // ────────────────────────────────────────────────────────────────
      boxShadow: {
        // Default UI atoms
        "xs":         "0 1px 2px rgba(20,20,20,0.04)",
        "sm":         "0 1px 0 rgba(20,20,20,0.03), 0 4px 12px -3px rgba(20,20,20,0.06)",
        // Cards
        "card":       "0 1px 0 rgba(20,20,20,0.03), 0 6px 16px -6px rgba(20,20,20,0.06), 0 18px 36px -22px rgba(11,61,46,0.08)",
        "card-hover": "0 1px 0 rgba(20,20,20,0.03), 0 14px 30px -10px rgba(20,20,20,0.12), 0 26px 56px -22px rgba(11,61,46,0.14)",
        "feature":    "0 2px 0 rgba(20,20,20,0.04), 0 22px 42px -14px rgba(20,20,20,0.16), 0 36px 70px -22px rgba(11,61,46,0.16)",
        // Floating UI
        "float":      "0 4px 0 rgba(20,20,20,0.04), 0 32px 56px -18px rgba(20,20,20,0.22), 0 56px 96px -28px rgba(11,61,46,0.22)",
        // Tinted (brand)
        "emerald":    "0 1px 0 rgba(11,61,46,0.04), 0 14px 30px -10px rgba(11,61,46,0.22), 0 28px 56px -20px rgba(11,61,46,0.26)",
        "scarlet":    "0 1px 0 rgba(200,16,46,0.04), 0 14px 30px -10px rgba(200,16,46,0.20), 0 28px 56px -20px rgba(200,16,46,0.24)",
        // Dark surfaces
        "dark":       "0 1px 0 rgba(255,255,255,0.04), 0 18px 36px -12px rgba(0,0,0,0.5), 0 32px 60px -20px rgba(0,0,0,0.6)",
        "dark-hover": "0 1px 0 rgba(255,255,255,0.06), 0 26px 50px -14px rgba(0,0,0,0.55), 0 48px 88px -24px rgba(0,0,0,0.7)",
        // Inset highlight (gives panels a subtle bevel)
        "inset-top":  "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(20,20,20,0.04)",
        // Hairline rule (fakes a 1px bottom border without layout shift)
        "rule":       "0 1px 0 rgba(20,20,20,0.06)",
        // Focus ring (offset, double-stroke)
        "focus":      "0 0 0 2px #FFFFFF, 0 0 0 4px #0B3D2E",
      },

      // ────────────────────────────────────────────────────────────────
      //  MOTION — restrained, considered curves. Reuse, don't reinvent.
      //  `emphasis` = signature curve for premium feel
      //  `standard` = baseline for hovers + state changes
      //  `decel`    = entrances
      //  `accel`    = exits / dismissals
      // ────────────────────────────────────────────────────────────────
      transitionTimingFunction: {
        "emphasis": "cubic-bezier(0.16, 1, 0.3, 1)",
        "standard": "cubic-bezier(0.4, 0, 0.2, 1)",
        "decel":    "cubic-bezier(0, 0, 0.2, 1)",
        "accel":    "cubic-bezier(0.4, 0, 1, 1)",
      },
      transitionDuration: {
        "180": "180ms",
        "280": "280ms",
        "480": "480ms",
        "640": "640ms",
        "720": "720ms",
      },

      // ────────────────────────────────────────────────────────────────
      //  ANIMATION
      // ────────────────────────────────────────────────────────────────
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "drift": {
          "0%, 100%": { transform: "translate(0,0) rotate(0deg)" },
          "50%":      { transform: "translate(20px,-20px) rotate(2deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%":      { opacity: "0.9",  transform: "scale(1.05)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up":    "fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
        "drift":      "drift 18s ease-in-out infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
      },
      backgroundImage: {
        "emerald-glow": "radial-gradient(circle at 50% 50%, rgba(31,107,79,0.4) 0%, transparent 60%)",
        "red-glow":     "radial-gradient(circle at 50% 50%, rgba(200,16,46,0.35) 0%, transparent 60%)",
        "warm-card":    "linear-gradient(180deg, #FFFFFF 0%, #FBF8F3 100%)",
        "ink-card":     "linear-gradient(180deg, #1A1A1A 0%, #060606 100%)",
        "rule-h":       "linear-gradient(90deg, transparent, #D6D0C4 8%, #D6D0C4 92%, transparent)",
        "rule-v":       "linear-gradient(180deg, transparent, #D6D0C4 8%, #D6D0C4 92%, transparent)",
      },
    },
  },
  plugins: [],
};
export default config;
