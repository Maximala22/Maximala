"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUserName } from "@/lib/storage";
import { seedFleetData } from "@/lib/fleetStorage";
import { seedContacts } from "@/lib/contacts";
import BottomNav from "./BottomNav";

const PUBLIC_PATHS = ["/login"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    seedFleetData();
    seedContacts();
    const user = getUserName();
    if (!user && !PUBLIC_PATHS.includes(pathname)) {
      router.replace("/login");
    }
    if (user && pathname === "/login") {
      router.replace("/hem");
    }
  }, [pathname, router]);

  const showNav = !PUBLIC_PATHS.includes(pathname);

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="mx-auto min-h-screen w-full max-w-md bg-background shadow-[0_0_60px_rgba(36,28,21,0.06)]">
        <main>{children}</main>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}
