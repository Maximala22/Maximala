import { cn } from "@/lib/utils";

export default function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted",
        className
      )}
    >
      {children}
    </h2>
  );
}
