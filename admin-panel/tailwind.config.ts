import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#08142A",
        foreground: "#F8FAFC",
        card: "#0D1B33",
        "card-2": "#10223F",
        border: "rgba(255,255,255,0.10)",
        muted: "#8EA0B8",
        accent: "#8BEA2B",
        destructive: "#EF4444",
        warning: "#F59E0B",
        success: "#22C55E"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(139,234,43,0.18), 0 18px 50px rgba(0,0,0,0.32)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
