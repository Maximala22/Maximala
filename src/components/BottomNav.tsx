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
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto w-full max-w-md border-t border-border/60 bg-card/90 px-2 shadow-nav backdrop-blur-xl backdrop-saturate-150">
        <div className="flex items-stretch justify-around">
          {tabs.map((tab) => {
            const active =
              pathname === tab.href || pathname.startsWith(tab.href + "/");
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex min-h-[50px] flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px]",
                  active ? "text-primary" : "text-muted"
                )}
              >
                <Icon
                  className="h-[22px] w-[22px]"
                  strokeWidth={active ? 2.25 : 1.75}
                />
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
