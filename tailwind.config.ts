import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./docs/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0c0f",
        fg: "#f4f7fb",
        muted: "#a6b0c0",
        line: "rgba(255,255,255,0.08)",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(0,0,0,0.25)"
      }
    },
  },
  plugins: [],
};

export default config;
