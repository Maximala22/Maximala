import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#FBF7F1",
        card: "#FFFFFF",
        text: "#241C15",
        muted: "#8A7A6B",
        border: "#E8D8C8",
        primary: "#C0612A",
        primaryDark: "#9E4F22",
        flemstromBlue: "#0097CF",
        flemstromBlueDark: "#00527C",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      boxShadow: {
        card: "0 2px 16px rgba(36, 28, 21, 0.07)",
        warm: "0 4px 24px rgba(192, 97, 42, 0.15)",
        lift: "0 8px 32px rgba(36, 28, 21, 0.1)",
        nav: "0 -4px 24px rgba(36, 28, 21, 0.06)",
      },
      borderRadius: {
        card: "1.25rem",
        xl: "1.5rem",
      },
      padding: {
        safe: "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [],
};

export default config;
