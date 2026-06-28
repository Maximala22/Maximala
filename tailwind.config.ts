import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#FBF7F1",
        card: "#FFFFFF",
        text: "#241C15",
        muted: "#8A7A6D",
        border: "#E8D8C8",
        primary: "#C8612A",
        primaryDark: "#A84D1F",
        primaryLight: "#F3DFD0",
        flemstromBlue: "#0097D7",
        flemstromBlueDark: "#005D8F",
        flemstromBlueLight: "#E6F6FC",
        success: "#159A62",
        successLight: "#E8F8EF",
        aiPurple: "#7C3AED",
        aiPurpleLight: "#F1EAFE",
        utilityCyan: "#0EA5A8",
        utilityCyanLight: "#E6FAFA",
        warning: "#D97706",
        danger: "#DC2626",
        dangerLight: "#FEE2E2",
      },
      boxShadow: {
        card: "0 2px 16px rgba(36, 28, 21, 0.07)",
        warm: "0 4px 24px rgba(200, 97, 42, 0.15)",
        lift: "0 8px 32px rgba(36, 28, 21, 0.1)",
        nav: "0 -4px 24px rgba(36, 28, 21, 0.06)",
      },
      borderRadius: {
        card: "1.25rem",
        xl: "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
