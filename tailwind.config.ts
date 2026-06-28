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
        "success-dark": "#0F7A4D",
        successLight: "#E8F8EF",
        note: "#F2B84B",
        "note-dark": "#B7791F",
        "note-light": "#FFF4D6",
        aiPurple: "#7C3AED",
        "aiPurple-dark": "#5B21B6",
        aiPurpleLight: "#F1EAFE",
        utilityCyan: "#0EA5A8",
        "utilityCyan-dark": "#0F766E",
        utilityCyanLight: "#E6FAFA",
        warning: "#D97706",
        "warning-light": "#FEF3C7",
        danger: "#DC2626",
        dangerLight: "#FEE2E2",
      },
      boxShadow: {
        card: "0 2px 16px rgba(36, 28, 21, 0.07)",
        warm: "0 4px 24px rgba(200, 97, 42, 0.18)",
        lift: "0 8px 32px rgba(21, 154, 98, 0.12)",
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
