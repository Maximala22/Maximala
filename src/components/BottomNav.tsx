"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Calendar, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/hem", label: "Hem", icon: Home },
  { href: "/jobb", label: "Jobb", icon: Briefcase },
  { href: "/kalender", label: "Kalender", icon: Calendar },
  { href: "/meny", label: "Meny", icon: Menu },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Huvudnavigation"
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 px-3"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="pointer-events-auto mx-auto w-full max-w-md rounded-[1.25rem] border border-border/70 bg-card/95 px-1 shadow-nav backdrop-blur-xl backdrop-saturate-150">
        <div className="flex items-stretch justify-around">
          {tabs.map((tab) => {
            const active =
              pathname === tab.href || pathname.startsWith(tab.href + "/");
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[58px] flex-1 flex-col items-center justify-center gap-1 py-2 text-xs",
                  active ? "text-primary" : "text-muted"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl",
                    active && "bg-primary/12"
                  )}
                >
                  <Icon
                    className="h-[22px] w-[22px]"
                    strokeWidth={active ? 2.25 : 1.75}
                  />
                </span>
                <span className={cn("leading-none", active ? "font-bold" : "font-medium")}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
