import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", ...fontFamily.sans],
        body: ["var(--font-body)", ...fontFamily.sans],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "0px",
        },
        screens: {
          "2xl": "1440px",
        },
      },
      colors: {
        bgWhite: "var(--bg-white)",
        bgModal: "var(--bg-modal)",
        white: "var(--white)",
        whiteBg: "var(--white-bg)",
        main: "var(--main)",
        hoverBg: "var(--hover-bg)",
        secondary: "var(--secondary)",
        fill: "var(--fill)",
        divider: "var(--divider)",
        title: "var(--title)",
        error: "var(--error)",
        errorBg: "var(--error-bg)",
        success: "var(--success)",
        successBg: "var(--success-bg)",
        warning: "var(--warning)",
        warningBg: "var(--warning-bg)",
        // Blue shades
        blue50: "var(--blue-50)",
        blue100: "var(--blue-100)",
        blue200: "var(--blue-200)",
        blue300: "var(--blue-300)",
        blue400: "var(--blue-400)",
        blue500: "var(--blue-500)",
        blue600: "var(--blue-600)",
        blue700: "var(--blue-700)",
        blue800: "var(--blue-800)",
        blue900: "var(--blue-900)",
        blue950: "var(--blue-950)",

        border: "hsl(var(--divider))",
      },
      borderRadius: {
        lg: "12px",
        md: "12px",
        sm: "4px",
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        spin: "spin 1s linear infinite",
      },
      backgroundImage: {
        auth_bg: "url('/images/auth-bg.webp')",
      },
      boxShadow: {
        "3xl": "13px 16px 12px 0px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-animated")],
} satisfies Config;

export default config;
