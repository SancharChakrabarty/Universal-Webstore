import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#015be8",
          dark: "#013ea8",
          light: "#2f7bf2",
        },
        tint: {
          DEFAULT: "#f0f4f9",
          dark: "#e8ecf0",
        },
        ink: {
          DEFAULT: "#14171f",
          soft: "#4a4f5c",
          faint: "#8b90a0",
        },
        surface: "#fafafa",
        line: "#e7e8ec",
        // strength scale: light blue -> deep navy
        strength: {
          1: "#e8ecf0",
          2: "#9cc3fb",
          3: "#5f96ee",
          4: "#2566de",
          5: "#0c3fa8",
          6: "#072463",
        },
      },
      fontFamily: {
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        body: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "14px",
        pill: "999px",
      },
      maxWidth: {
        shell: "1320px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeSlide: {
          "0%": { opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        fadeSlide: "fadeSlide 5s ease-in-out infinite",
        fadeIn: "fadeIn 0.25s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
