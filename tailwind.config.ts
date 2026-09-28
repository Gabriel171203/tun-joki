import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        earth: {
          50: "#FCF9F8",
          100: "#F7F1F2",
          200: "#EFE5E7",
          300: "#E2D3D6",
          400: "#C6AFB5",
          500: "#846D7A",
          600: "#7D6572",
          700: "#6A5360",
          800: "#51404C",
          900: "#3A2D36",
          950: "#2A2027",
        },
        terracotta: {
          50: "#FDF7FA",
          100: "#FBEFF5",
          200: "#F6DCE9",
          300: "#EAC5DE",
          400: "#DD8FB6",
          500: "#B8507F",
          600: "#9C3F69",
          700: "#7D3254",
          800: "#632842",
          900: "#4A1F33",
        },
        emerald: {
          50: "#F0F7F4",
          100: "#DCEEE5",
          200: "#BBDDCD",
          300: "#8FC5AD",
          400: "#5FA88A",
          500: "#3B8C6D",
          600: "#2B7157",
          700: "#235B47",
          800: "#1D4939",
          900: "#183D30",
        },
        navy: {
          50: "#F8F1F4",
          100: "#F1E2E9",
          200: "#E4CDD9",
          300: "#CFAEC3",
          400: "#B692AB",
          500: "#9A7390",
          600: "#7E5C76",
          700: "#65485E",
          800: "#4E3447",
          900: "#3B2635",
          950: "#2B1B26",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
      },
      boxShadow: {
        warm: "0 10px 30px -5px rgba(51, 32, 47, 0.07), 0 4px 10px -2px rgba(51, 32, 47, 0.04)",
        "warm-lg": "0 20px 40px -10px rgba(51, 32, 47, 0.12), 0 8px 16px -4px rgba(51, 32, 47, 0.06)",
        card: "0 2px 12px 0 rgba(51, 32, 47, 0.06)",
      },
      borderRadius: {
        "organic": "2rem",
        "organic-lg": "2.5rem",
      }
    },
  },
  plugins: [],
};
export default config;
