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
        "mb-3 text-xs font-bold uppercase tracking-[0.08em] text-muted",
        className
      )}
    >
      {children}
    </h2>
  );
}
