import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#131126",
        muted: "#6B6880",
        subtle: "#8B879C",
        line: "#E7E3F4",
        card: "#FFFFFF",
        violet: {
          DEFAULT: "#6D4CF2",
          dark: "#5B3AE0",
          light: "#8A6FF5",
        },
        panel: "#0E0C1A",
        panel2: "#171429",
        panelLine: "#2B2740",
      },
      fontFamily: {
        display: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Inter", "sans-serif"],
        body: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Inter", "sans-serif"],
        mono: ["SF Mono", "IBM Plex Mono", "ui-monospace", "Menlo", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(19, 17, 38, 0.04), 0 12px 32px -12px rgba(109, 76, 242, 0.18)",
        glow: "0 0 0 4px rgba(109, 76, 242, 0.10)",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at 18% 20%, rgba(196, 181, 253, 0.55), transparent 45%), radial-gradient(circle at 85% 15%, rgba(253, 224, 191, 0.5), transparent 40%), linear-gradient(180deg, #FBFAFF 0%, #F7F5FD 100%)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        sparkle: {
          "0%, 100%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(8deg) scale(1.08)" },
        },
      },
      animation: {
        rise: "rise 0.5s ease-out both",
        pulseDot: "pulseDot 2s ease-in-out infinite",
        sparkle: "sparkle 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
