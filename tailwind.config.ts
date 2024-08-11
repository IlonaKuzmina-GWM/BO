import type { Config } from "tailwindcss";

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
        // bg_white: "#F5F7F9",
        // white: "#FFFFFF",
        // main: "#495465",
        // hover_bg: "#E9EDF5",
        // // secondary: "#98989880",
        // fill: "#E9EDF5B2",
        // divider: "#E1E2E5",
        // title: "#222834",
        // error: "#D1293D",
        // error_bg: "#FFEDEF",
        // success: "#14804A",
        // success_bg: "#E1FCEF",
        // warning: "#AA5B00",
        // warning_bg: "#FCF2E6",

        // blue_50: "#EEF6FF",
        // blue_100: "#D9EAFF",
        // blue_200: "#BCDBFF",
        // blue_300: "#8EC6FF",
        // blue_400: "#59A5FF",
        // blue_500: "#2F7FFF",
        // blue_600: "#1B60F5",
        // blue_700: "#144BE1",
        // blue_800: "#173DB6",
        // blue_900: "#19388F",
        // blue_950: "#142357",

        bgWhite: "var(--bg-white)",
        white: "var(--white)",
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

        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
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
      },
      backgroundImage: {
        auth_bg: "url('/images/auth-bg.webp')",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("tailwindcss-animated")
  ],
} satisfies Config;

export default config;
