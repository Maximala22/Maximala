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
        <div className="flex items-stretch justify-around rounded-t-2xl border border-border/50 bg-card/95 px-0.5 shadow-nav backdrop-blur-md">
          {tabs.map((tab) => {
            const active =
              pathname === tab.href || pathname.startsWith(tab.href + "/");
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors",
                  active ? "text-primary" : "text-muted/70"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                    active && "bg-primary/12"
                  )}
                >
                  <Icon
                    className="h-[18px] w-[18px]"
                    strokeWidth={active ? 2.5 : 1.75}
                    fill={active ? "currentColor" : "none"}
                  />
                </div>
                <span className={cn("font-medium leading-none", active && "font-bold")}>
                  {tab.label}
                </span>
                {tab.showCount && jobCount > 0 && (
                  <span
                    className={cn(
                      "text-[9px] leading-none",
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
