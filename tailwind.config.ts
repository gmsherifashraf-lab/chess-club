import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory:  "#F8F5F0",
        ivory2: "#EDE9E2",
        stone:  "#D6D0C4",
        ink:    "#141414",
        ink2:   "#262626",
        ink3:   "#555555",
        red:    "#D42B3C",
        "red-dk":"#B02030",
        green:  "#006B30",
        green2: "#007A38",
        gold:   "#A07820",
      },
      fontFamily: {
        "noto-ar":  ['"Noto Sans Arabic"', "sans-serif"],
        "noto-ser": ['"Noto Serif Arabic"', "serif"],
        "playfair": ['"Playfair Display"', "Georgia", "serif"],
        "dm":       ['"DM Sans"', "sans-serif"],
      },
      maxWidth: {
        wrap:   "1240px",
        "wrap-md": "960px",
        "wrap-sm": "760px",
      },
    },
  },
  plugins: [],
};
export default config;
