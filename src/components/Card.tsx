import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
};

export default function Card({ children, className, onClick, interactive }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-card p-4 shadow-card",
        (onClick || interactive) && "cursor-pointer transition active:scale-[0.98] hover:shadow-lift",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      {children}
    </div>
  );
}
