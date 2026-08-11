import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "var(--brand-50, #f0f7ff)",
          100: "var(--brand-100, #e0effe)",
          200: "var(--brand-200, #bae0fd)",
          300: "var(--brand-300, #7cc8fd)",
          400: "var(--brand-400, #36aafd)",
          500: "var(--brand-500, #0c8ee9)",
          600: "var(--brand-600, #0270c7)",
          700: "var(--brand-700, #0359a1)",
          800: "var(--brand-800, #074c85)",
          900: "var(--brand-900, #0c3f6e)",
          950: "var(--brand-950, #072849)",
        },
        surface: {
          light: "#ffffff",
          dark: "#0b0f17",
          cardLight: "#f8fafc",
          cardDark: "#131b2e",
          borderLight: "#e2e8f0",
          borderDark: "#1e293b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-subtle": "pulseSubtle 4s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "glow": "0 0 40px -10px rgba(12, 142, 233, 0.15)",
        "card-hover": "0 20px 30px -10px rgba(0, 0, 0, 0.08)",
        "card-hover-dark": "0 20px 30px -10px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
