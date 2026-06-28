"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { getStatusSummary } from "@/lib/aiStatus";
import { cn } from "@/lib/utils";

export default function AIStatusCard({ compact }: { compact?: boolean }) {
  const summary = getStatusSummary();

  return (
    <Link
      href="/status"
      className={cn(
        "flex flex-col justify-between rounded-[1.15rem] p-3.5 shadow-card transition active:scale-[0.98]",
        compact ? "min-h-[110px]" : "min-h-[140px]",
        summary.allGood
          ? "bg-gradient-to-br from-emerald-50 to-green-50"
          : "bg-gradient-to-br from-amber-50 to-orange-50"
      )}
    >
      <div className="flex items-start justify-between">
        {summary.allGood ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" strokeWidth={2} />
        ) : (
          <AlertCircle className="h-5 w-5 text-amber-600" strokeWidth={2} />
        )}
      </div>
      <div className="mt-auto">
        <p
          className={cn(
            "font-semibold leading-snug",
            compact ? "text-[15px]" : "text-base",
            summary.allGood ? "text-emerald-800" : "text-amber-900"
          )}
        >
          {summary.allGood ? "Allt ser bra ut" : summary.summaryText}
        </p>
        {!compact && !summary.allGood && summary.items.length > 0 && (
          <p className="mt-1 line-clamp-2 text-sm text-muted">
            {summary.items[0].message}
          </p>
        )}
        {compact && !summary.allGood && (
          <p className="mt-0.5 text-xs text-muted line-clamp-1">
            {summary.items[0]?.message}
          </p>
        )}
      </div>
      {compact && (
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
          Att kolla
        </p>
      )}
    </Link>
  );
}
