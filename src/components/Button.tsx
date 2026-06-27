import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition active:scale-[0.98] active:opacity-90 disabled:opacity-50",
        fullWidth && "w-full",
        size === "sm" && "px-3 py-2 text-sm",
        size === "md" && "px-5 py-3 text-base",
        size === "lg" && "px-6 py-4 text-lg",
        variant === "primary" && "bg-primary text-white shadow-warm hover:bg-primaryDark",
        variant === "secondary" && "bg-card text-text border border-border shadow-card",
        variant === "ghost" && "bg-transparent text-primary",
        variant === "danger" && "bg-danger text-white",
        variant === "success" && "bg-success text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
