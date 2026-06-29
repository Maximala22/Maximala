"use client";

import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { getStatusSummary } from "@/lib/aiStatus";
import { cn } from "@/lib/utils";

type Props = {
  compact?: boolean;
};

export default function AIStatusCard({ compact }: Props) {
  const summary = getStatusSummary();

  return (
    <Link
      href="/status"
      className={cn(
        "flex flex-col justify-between rounded-[1.25rem] p-3.5 shadow-card transition active:scale-[0.98]",
        compact ? "min-h-[88px]" : "min-h-[120px]",
        summary.allGood
          ? "border border-success/20 bg-successLight"
          : "border border-warning/20 bg-warning-light"
      )}
    >
      <div className="flex items-start gap-2">
        {summary.allGood ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" strokeWidth={2} />
        ) : (
          <AlertCircle className="h-5 w-5 shrink-0 text-warning" strokeWidth={2} />
        )}
        <p
          className={cn(
            "font-bold leading-snug",
            compact ? "text-sm" : "text-base",
            summary.allGood ? "text-success" : "text-text"
          )}
        >
          {summary.summaryText}
        </p>
      </div>
      {!summary.allGood && summary.items[0] && (
        <p className="mt-2 text-xs text-muted line-clamp-2">{summary.items[0].message}</p>
      )}
    </Link>
  );
}
