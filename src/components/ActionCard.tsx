"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionCardVariant =
  | "primary"
  | "report"
  | "note"
  | "success"
  | "warning"
  | "ai"
  | "utility"
  | "info"
  | "neutral";

type ActionCardProps = {
  variant: ActionCardVariant;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  href?: string;
  onClick?: () => void;
  size?: "hero" | "md" | "sm";
  className?: string;
};

const styles: Record<
  ActionCardVariant,
  { gradient: string; soft: string; icon: string; text: string; sub: string }
> = {
  primary: {
    gradient: "bg-gradient-to-br from-primary to-primaryDark text-white shadow-warm",
    soft: "bg-primaryLight border border-primary/15 text-text",
    icon: "bg-white/20 text-white",
    text: "text-text",
    sub: "text-muted",
  },
  report: {
    gradient: "bg-gradient-to-br from-flemstromBlue to-flemstromBlueDark text-white shadow-card",
    soft: "bg-flemstromBlueLight border border-flemstromBlue/15 text-text",
    icon: "bg-flemstromBlue/15 text-flemstromBlue",
    text: "text-text",
    sub: "text-muted",
  },
  note: {
    gradient: "bg-gradient-to-br from-note to-note-dark text-text shadow-card",
    soft: "bg-note-light border border-note/25 text-text",
    icon: "bg-note/20 text-note-dark",
    text: "text-text",
    sub: "text-muted",
  },
  success: {
    gradient: "bg-gradient-to-br from-success to-success-dark text-white shadow-lift",
    soft: "bg-successLight border border-success/15 text-text",
    icon: "bg-success/15 text-success",
    text: "text-text",
    sub: "text-muted",
  },
  warning: {
    gradient: "bg-gradient-to-br from-warning to-[#B45309] text-white shadow-card",
    soft: "bg-warning-light border border-warning/20 text-text",
    icon: "bg-warning/15 text-warning",
    text: "text-text",
    sub: "text-muted",
  },
  ai: {
    gradient: "bg-gradient-to-br from-aiPurple to-aiPurple-dark text-white shadow-card",
    soft: "bg-aiPurpleLight border border-aiPurple/15 text-text",
    icon: "bg-aiPurple/15 text-aiPurple",
    text: "text-text",
    sub: "text-muted",
  },
  utility: {
    gradient: "bg-gradient-to-br from-utilityCyan to-utilityCyan-dark text-white shadow-card",
    soft: "bg-utilityCyanLight border border-utilityCyan/15 text-text",
    icon: "bg-utilityCyan/15 text-utilityCyan-dark",
    text: "text-text",
    sub: "text-muted",
  },
  info: {
    gradient: "bg-gradient-to-br from-flemstromBlue to-flemstromBlueDark text-white shadow-card",
    soft: "bg-flemstromBlueLight border border-flemstromBlue/15 text-text",
    icon: "bg-flemstromBlue/15 text-flemstromBlue",
    text: "text-text",
    sub: "text-muted",
  },
  neutral: {
    gradient: "bg-gradient-to-br from-[#8A7A6D] to-[#6B5E54] text-white shadow-card",
    soft: "bg-card border border-border text-text",
    icon: "bg-background text-muted",
    text: "text-text",
    sub: "text-muted",
  },
};

export default function ActionCard({
  variant,
  title,
  subtitle,
  icon: Icon,
  href,
  onClick,
  size = "md",
  className,
}: ActionCardProps) {
  const s = styles[variant];
  const isHero = size === "hero";
  const isSm = size === "sm";
  const useGradient = isHero || size === "md";

  const inner = (
    <>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl",
          useGradient ? s.icon : s.icon,
          isHero ? "h-12 w-12" : isSm ? "h-9 w-9" : "h-10 w-10"
        )}
      >
        <Icon className={isHero ? "h-6 w-6" : "h-5 w-5"} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-bold leading-snug",
            isHero ? "text-xl" : isSm ? "text-sm" : "text-base",
            useGradient ? "text-inherit" : s.text
          )}
        >
          {title}
        </p>
        {subtitle && (
          <p
            className={cn(
              "mt-0.5 leading-snug",
              isSm ? "text-[11px]" : "text-sm",
              useGradient ? "opacity-85" : s.sub
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {(isHero || size === "md") && href && (
        <ChevronRight className={cn("h-5 w-5 shrink-0 opacity-70", useGradient && "text-inherit")} />
      )}
    </>
  );

  const baseClass = cn(
    "flex w-full items-center gap-3 rounded-[1.25rem] transition active:scale-[0.98]",
    useGradient ? s.gradient : s.soft,
    isHero && "min-h-[120px] flex-col items-start justify-between p-5",
    size === "md" && "min-h-[88px] p-4",
    isSm && "min-h-[76px] flex-col items-start justify-end p-3.5",
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {isHero ? (
          <>
            <div className="flex w-full items-start justify-between">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", s.icon)}>
                <Icon className="h-7 w-7" strokeWidth={2} />
              </div>
            </div>
            <div>
              <p className="text-xl font-extrabold leading-tight">{title}</p>
              {subtitle && <p className="mt-1 text-sm opacity-90">{subtitle}</p>}
            </div>
          </>
        ) : (
          inner
        )}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cn(baseClass, "text-left")}>
      {inner}
    </button>
  );
}
