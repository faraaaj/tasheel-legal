import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: "#070D19",
        "navy-light": "#112240",
        gold: "#C5A880",
        cream: "#FAF9F6",
      },
      fontFamily: {
        "serif-en": ["var(--font-cormorant)", "serif"],
        "sans-en": ["var(--font-inter)", "sans-serif"],
        "sans-ar": [
          "var(--font-tajawal)",
          "var(--font-tajawal-latin)",
          "Tahoma",
          "sans-serif",
        ],
      },
      letterSpacing: {
        mega: "0.3em",
      },
      maxWidth: {
        shell: "1280px",
      },
      keyframes: {
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
      },
      animation: {
        'slow-zoom': 'slow-zoom 20s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};

export default config;
