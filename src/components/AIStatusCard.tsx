"use client";

import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { getStatusSummary } from "@/lib/aiStatus";
import { cn } from "@/lib/utils";

export default function AIStatusCard({ compact }: { compact?: boolean }) {
  const summary = getStatusSummary();

  return (
    <Link
      href="/status"
      className={cn(
        "flex min-h-[140px] flex-col justify-between rounded-[1.25rem] p-4 shadow-card transition active:scale-[0.98]",
        summary.allGood
          ? "bg-gradient-to-br from-emerald-50 to-green-50"
          : "bg-gradient-to-br from-amber-50 to-orange-50"
      )}
    >
      <div className="flex items-start justify-between">
        {summary.allGood ? (
          <CheckCircle2 className="h-6 w-6 text-emerald-600" strokeWidth={2} />
        ) : (
          <AlertCircle className="h-6 w-6 text-amber-600" strokeWidth={2} />
        )}
      </div>
      <div className="mt-auto">
        <p
          className={cn(
            "font-semibold leading-snug",
            summary.allGood ? "text-emerald-800" : "text-amber-900"
          )}
        >
          {summary.summaryText}
        </p>
        {!compact && !summary.allGood && summary.items.length > 0 && (
          <p className="mt-1 line-clamp-2 text-sm text-muted">
            {summary.items[0].message}
          </p>
        )}
      </div>
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
        Att kolla
      </p>
    </Link>
  );
}
