"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const LOGO_SOURCES = [
  "/flemstrom-logo-transparent.png",
  "/flemstrom-logo.webp",
  "/flemstrom-logo.png",
  "/flemstrom-logo.svg",
];

type BrandLogoSize = "small" | "medium" | "large" | "sm" | "md" | "lg";

type BrandLogoProps = {
  size?: BrandLogoSize;
  variant?: "plain" | "card";
  className?: string;
};

const sizeClasses: Record<"small" | "medium" | "large", string> = {
  small: "h-10 max-h-[48px] max-w-[120px]",
  medium: "h-16 max-h-[72px] max-w-[180px]",
  large: "h-24 max-h-[100px] max-w-[260px]",
};

function normalizeSize(size: BrandLogoSize): "small" | "medium" | "large" {
  if (size === "sm" || size === "small") return "small";
  if (size === "lg" || size === "large") return "large";
  return "medium";
}

function FallbackText({
  normalized,
  className,
}: {
  normalized: "small" | "medium" | "large";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-extrabold uppercase tracking-[0.18em] text-flemstromBlue",
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
  const isSvg = src.endsWith(".svg");
  const needsBlend = !isSvg;

  const image = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt="Flemströms"
      className={cn(
        sizeClass,
        "w-auto object-contain",
        needsBlend && "mix-blend-multiply",
        isSvg && "drop-shadow-sm"
      )}
      onError={() => {
        if (srcIndex < LOGO_SOURCES.length - 1) {
          setSrcIndex((i) => i + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );

  if (variant === "card") {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-[1.5rem] bg-background/80 px-5 py-3",
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
