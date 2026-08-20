import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        char: "#14110F",
        surface: "#1D1914",
        surface2: "#26201A",
        line: "#3A322A",
        ember: "#FF5A2E",
        amber: "#FFB020",
        parch: "#F3EEE4",
        muted: "#9C948A",
      },
      fontFamily: {
        display: ["Iowan Old Style", "Palatino Linotype", "Georgia", "ui-serif", "serif"],
        body: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Inter", "sans-serif"],
        mono: ["SF Mono", "IBM Plex Mono", "ui-monospace", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(255, 90, 46, 0.25)",
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        flicker: "flicker 3.2s ease-in-out infinite",
        rise: "rise 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
