"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Calendar, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { getActiveJobs } from "@/lib/storage";

const tabs = [
  { href: "/hem", label: "Hem", icon: Home },
  { href: "/jobb", label: "Jobb", icon: Briefcase, showCount: true },
  { href: "/kalender", label: "Kalender", icon: Calendar },
  { href: "/meny", label: "Meny", icon: Menu },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [jobCount, setJobCount] = useState(0);

  useEffect(() => {
    setJobCount(getActiveJobs().length);
  }, [pathname]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto w-full max-w-md px-3">
        <div className="flex items-stretch justify-around rounded-t-3xl border border-border/60 bg-card/95 px-1 shadow-nav backdrop-blur-md">
          {tabs.map((tab) => {
            const active =
              pathname === tab.href || pathname.startsWith(tab.href + "/");
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-3 text-[11px] transition-colors",
                  active ? "text-primary" : "text-muted/80"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                    active && "bg-primary/10"
                  )}
                >
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={active ? 2.25 : 1.75}
                    fill={active ? "currentColor" : "none"}
                  />
                </div>
                <span className={cn("font-medium", active && "font-semibold")}>
                  {tab.label}
                </span>
                {tab.showCount && jobCount > 0 && (
                  <span
                    className={cn(
                      "text-[10px] leading-none",
                      active ? "text-primary" : "text-muted"
                    )}
                  >
                    {jobCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
