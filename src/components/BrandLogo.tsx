"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const LOGO_VERSION = "1";
const LOGO_SOURCES = [
  `/flemstrom-logo.png?v=${LOGO_VERSION}`,
  `/flemstrom-logo-transparent.png?v=${LOGO_VERSION}`,
  "/flemstrom-logo.svg",
];

type BrandLogoSize = "small" | "medium" | "large" | "hero" | "sm" | "md" | "lg";

type BrandLogoProps = {
  size?: BrandLogoSize;
  variant?: "plain" | "soft";
  className?: string;
};

/** Horizontal logo — width-led sizing */
const sizeClasses: Record<"small" | "medium" | "large" | "hero", string> = {
  small: "h-8 w-auto max-w-[120px]",
  medium: "h-12 w-auto max-w-[180px]",
  large: "h-16 w-auto max-w-[240px]",
  hero: "h-[72px] w-auto max-w-[300px]",
};

function normalizeSize(size: BrandLogoSize): "small" | "medium" | "large" | "hero" {
  if (size === "sm" || size === "small") return "small";
  if (size === "lg" || size === "large") return "large";
  if (size === "hero") return "hero";
  return "medium";
}

function FallbackText({
  normalized,
  className,
}: {
  normalized: "small" | "medium" | "large" | "hero";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-extrabold uppercase tracking-[0.18em] text-flemstromBlue",
        normalized === "hero" && "text-3xl",
        normalized === "large" && "text-2xl",
        normalized === "medium" && "text-xl",
        normalized === "small" && "text-sm",
        className
      )}
    >
      FLEMSTRÖMS
    </div>
  );
}

export default function BrandLogo({
  size = "medium",
  variant = "plain",
  className,
}: BrandLogoProps) {
  const [srcIndex, setSrcIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const normalized = normalizeSize(size);
  const sizeClass = sizeClasses[normalized];

  if (failed || srcIndex >= LOGO_SOURCES.length) {
    return <FallbackText normalized={normalized} className={className} />;
  }

  const src = LOGO_SOURCES[srcIndex];

  const image = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt="Flemströms"
      className={cn(sizeClass, "object-contain")}
      onError={() => {
        if (srcIndex < LOGO_SOURCES.length - 1) {
          setSrcIndex((i) => i + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );

  if (variant === "soft") {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-[1.5rem] px-4 py-3",
          className
        )}
      >
        {image}
      </div>
    );
  }

  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      {image}
    </div>
  );
}
