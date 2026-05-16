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
        // Legacy aliases (kept, re-pointed to the federation palette so
        // every existing utility class re-skins with zero file churn).
        ivory:   "#FCFCFB",
        ivory2:  "#F6F6F4",
        stone:   "#E6E6E2",
        ink:     "#111111",
        ink2:    "#1A1A1A",
        ink3:    "#363636",
        emerald: "#0A5234",
        emerald2:"#117A4F",
        emerald3:"#0C6340",
        red:     "#C8102E",
        "red-dk":"#A50D26",
        white:   "#FFFFFF",
        green:   "#0A5234",
        green2:  "#117A4F",
        gold:    "#0A5234",

        // ── New semantic / scaled palette ──
        // Neutral surface scale (was "cream" — now clean federation greys)
        cream: {
          50:  "#FFFFFF",
          100: "#FCFCFB",
          200: "#F6F6F4", // = ivory2
          300: "#F0F0EC",
          400: "#E9E9E5",
          500: "#E0E0DB",
          600: "#D2D2CC", // = stone-ish
          700: "#B6B6AF",
          800: "#8E8E88",
        },
        // Onyx — refined near-black tones (tinted, never pure)
        onyx: {
          50:  "#363636",
          100: "#2A2A2A",
          200: "#1F1F1F",
          300: "#161616",
          400: "#111111",
          500: "#0C0C0C",
          600: "#070707",
        },
        // Text scale — semantic
        text: {
          DEFAULT: "#111111",
          1:       "#111111",
          2:       "#363636",
          3:       "#5E5E5E",
          4:       "#8C8C8A",
          inverse: "#F4F6F4",
        },
        // Border scale — semantic
        line: {
          DEFAULT: "#E6E6E2",
          soft:    "rgba(17,17,17,0.06)",
          mid:     "#DADAD5",
          strong:  "#C2C2BC",
          dark:    "rgba(255,255,255,0.12)",
        },
        // Brand green scale (primary identity)
        forest: {
          50:  "#E9F3EE",
          100: "#D6EADF",
          200: "#A9CFBC",
          300: "#6FB191",
          400: "#2C9A6A",
          500: "#117A4F", // = emerald2 (hover)
          600: "#0C6340", // = emerald3
          700: "#0A5234", // = emerald (primary)
          800: "#073F28",
          900: "#052B1C",
        },
        // Brand red scale (UAE accent — sparing)
        scarlet: {
          50:  "#FBE9EC",
          100: "#F4C4CC",
          200: "#E88A98",
          300: "#DC4259",
          400: "#C8102E", // = red
          500: "#A50D26", // = red-dk
          600: "#800A1D",
          700: "#5C0715",
        },
        // Honour — folded to brand green (4-colour brief, no gold)
        honor: {
          200: "#A9CFBC",
          300: "#2C9A6A",
          400: "#0A5234", // = gold alias
          500: "#073F28",
          600: "#052B1C",
        },
      },

      // ────────────────────────────────────────────────────────────────
      //  TYPOGRAPHY
      // ────────────────────────────────────────────────────────────────
      fontFamily: {
        // Legacy aliases (kept, re-pointed to the federation fonts)
        "noto-ar":  ['var(--font-cairo)', '"Noto Sans Arabic"', "sans-serif"],
        "noto-ser": ['var(--font-cairo)', '"Noto Sans Arabic"', "sans-serif"],
        "playfair": ['var(--font-playfair)', '"IBM Plex Sans"', "system-ui", "sans-serif"],
        "dm":       ['var(--font-inter)', "system-ui", "sans-serif"],
        // Semantic aliases that resolve to the next/font CSS vars set
        // in src/app/layout.tsx (Latin → IBM Plex Sans, Arabic → Cairo)
        disp: ['var(--font-playfair)', '"IBM Plex Sans"', "system-ui", "sans-serif"],
        body: ['var(--font-inter)',    "system-ui", "sans-serif"],
        ar:   ['var(--font-cairo)',    '"Noto Sans Arabic"', "sans-serif"],
      },
      fontSize: {
        "micro":   ["0.6875rem", { lineHeight: "1.4",  letterSpacing: "0.16em" }],
        "eyebrow": ["0.8125rem", { lineHeight: "1.4",  letterSpacing: "0.2em"  }],
        "caption": ["0.875rem",  { lineHeight: "1.5",  letterSpacing: "0.005em" }],
        // Federation display scale (fluid, ratio >= 1.25)
        "d-sm":  ["clamp(1.5rem, 2.4vw, 2rem)",      { lineHeight: "1.2",  letterSpacing: "-0.018em" }],
        "d-md":  ["clamp(2.125rem, 3.6vw, 3.25rem)", { lineHeight: "1.12", letterSpacing: "-0.022em" }],
        "d-lg":  ["clamp(2.75rem, 5vw, 4.5rem)",     { lineHeight: "1.06", letterSpacing: "-0.028em" }],
        "d-xl":  ["clamp(3.4rem, 7.4vw, 7rem)",      { lineHeight: "1.02", letterSpacing: "-0.03em"  }],
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
      zIndex: {
        "-10": "-10",
        "-20": "-20",
      },
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
        // Glow removed (no neon). Soft neutral wash only.
        "emerald-glow": "radial-gradient(circle at 50% 50%, rgba(10,82,52,0.06) 0%, transparent 65%)",
        "red-glow":     "radial-gradient(circle at 50% 50%, rgba(200,16,46,0.05) 0%, transparent 65%)",
        "warm-card":    "linear-gradient(180deg, #FFFFFF 0%, #FCFCFB 100%)",
        "ink-card":     "linear-gradient(180deg, #11201A 0%, #0C1310 100%)",
        "rule-h":       "linear-gradient(90deg, transparent, #DADAD5 8%, #DADAD5 92%, transparent)",
        "rule-v":       "linear-gradient(180deg, transparent, #DADAD5 8%, #DADAD5 92%, transparent)",
      },
    },
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2.5rem", xl: "3rem" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1320px" },
    },
  },
  plugins: [],
};
export default config;
