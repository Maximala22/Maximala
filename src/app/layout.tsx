import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { appConfig } from "@/lib/appConfig";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: appConfig.appName,
  description: appConfig.subtitle,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jobbminne",
  },
  icons: {
    icon: [
      { url: "/favicon.png?v=5", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png?v=5", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png?v=5", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png?v=5",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#C8612A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={manrope.variable}>
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
