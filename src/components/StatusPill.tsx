import type { JobStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusColors: Record<JobStatus, string> = {
  "Ej planerat": "bg-gray-100 text-gray-700",
  Planerad: "bg-blue-50 text-flemstromBlueDark",
  Pågående: "bg-amber-50 text-amber-700",
  Klar: "bg-green-50 text-green-700",
  Uppföljning: "bg-purple-50 text-purple-700",
};

export default function StatusPill({ status, className }: { status: JobStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 text-xs font-semibold",
        statusColors[status],
        className
      )}
    >
      {status}
    </span>
  );
}
