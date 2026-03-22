import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        mist: "#f8fafc",
        signal: "#0f766e",
        coral: "#f97316",
        amber: "#f59e0b",
        sky: "#0284c7"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        panel: "0 20px 60px rgba(15, 23, 42, 0.08)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(15,118,110,0.16), transparent 28%), radial-gradient(circle at 20% 20%, rgba(249,115,22,0.18), transparent 24%), linear-gradient(135deg, rgba(255,255,255,0.92), rgba(240,249,255,0.8))"
      }
    }
  },
  plugins: []
};

export default config;
