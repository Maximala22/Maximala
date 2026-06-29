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
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl font-bold transition active:scale-[0.98]",
        fullWidth && "w-full",
        size === "sm" && "px-3 py-2 text-sm",
        size === "md" && "px-5 py-3 text-base",
        size === "lg" && "px-6 py-3.5 text-base",
        variant === "primary" &&
          !disabled &&
          "bg-primary text-white shadow-warm hover:bg-primaryDark active:opacity-90",
        variant === "primary" &&
          disabled &&
          "cursor-not-allowed border border-border bg-background text-muted shadow-none active:scale-100",
        variant === "secondary" &&
          !disabled &&
          "border border-border bg-card text-text shadow-card active:opacity-90",
        variant === "secondary" &&
          disabled &&
          "cursor-not-allowed border border-border bg-background text-muted/60 shadow-none active:scale-100",
        variant === "ghost" && "bg-transparent text-primary",
        variant === "danger" && !disabled && "bg-danger text-white",
        variant === "danger" && disabled && "cursor-not-allowed bg-dangerLight text-muted",
        variant === "success" && !disabled && "bg-success text-white",
        variant === "success" && disabled && "cursor-not-allowed bg-successLight text-muted",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
