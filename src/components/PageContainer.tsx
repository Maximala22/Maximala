import { cn } from "@/lib/utils";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Skip extra bottom padding when page handles it itself (e.g. login) */
  compact?: boolean;
};

export default function PageContainer({ children, className, compact }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md px-4",
        compact
          ? "pb-6 pt-[max(0.75rem,env(safe-area-inset-top))]"
          : "nav-safe-bottom pt-[max(0.75rem,env(safe-area-inset-top))]",
        className
      )}
    >
      {children}
    </div>
  );
}
