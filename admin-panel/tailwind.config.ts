import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#07111F",
        foreground: "#F8FAFC",
        card: "#0B1728",
        "card-2": "#101D30",
        border: "rgba(226,232,240,0.10)",
        muted: "#94A3B8",
        accent: "#A3D65C",
        destructive: "#EF4444",
        warning: "#F59E0B",
        success: "#34D399"
      },
      boxShadow: {
        glow: "0 18px 48px rgba(0,0,0,0.34), 0 0 0 1px rgba(226,232,240,0.08)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
