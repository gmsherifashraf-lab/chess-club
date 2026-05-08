import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Legacy ivory tones — kept for the existing dashboards / RTL pages.
        ivory:  "#F8F5F0",
        ivory2: "#EDE9E2",
        stone:  "#D6D0C4",

        // Luxury palette — black dominant, deep emerald primary,
        // white text, scarlet red as a sparing highlight.
        ink:     "#000000",
        ink2:    "#0A0A0A",
        ink3:    "#1A1A1A",
        emerald: "#0B3D2E",  // deep, primary
        emerald2:"#1F6B4F",  // brighter accent for hover / glows
        emerald3:"#0E5236",  // mid-tone for ribbons
        red:     "#C8102E",  // UAE-flag red, sparing highlight
        "red-dk":"#9D0C24",
        white:   "#FFFFFF",
        // Backwards-compat aliases used by older components.
        green:   "#0B3D2E",
        green2:  "#1F6B4F",
        gold:    "#A07820",
      },
      fontFamily: {
        "noto-ar":  ['"Noto Sans Arabic"', "sans-serif"],
        "noto-ser": ['"Noto Serif Arabic"', "serif"],
        "playfair": ['"Playfair Display"', "Georgia", "serif"],
        "dm":       ['"DM Sans"', "sans-serif"],
      },
      maxWidth: {
        wrap:   "1320px",
        "wrap-md": "1040px",
        "wrap-sm": "780px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "drift": {
          "0%, 100%": { transform: "translate(0,0) rotate(0deg)" },
          "50%": { transform: "translate(20px,-20px) rotate(2deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.05)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(.2,.8,.2,1) both",
        "drift":   "drift 18s ease-in-out infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
      },
      backgroundImage: {
        "emerald-glow": "radial-gradient(circle at 50% 50%, rgba(31,107,79,0.4) 0%, transparent 60%)",
        "red-glow":     "radial-gradient(circle at 50% 50%, rgba(200,16,46,0.35) 0%, transparent 60%)",
      },
    },
  },
  plugins: [],
};
export default config;
