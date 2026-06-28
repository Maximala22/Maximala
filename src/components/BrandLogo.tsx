"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const LOGO_SOURCES = [
  "/flemstrom-logo-transparent.png",
  "/flemstrom-logo.svg",
];

type BrandLogoSize = "small" | "medium" | "large" | "hero" | "sm" | "md" | "lg";

type BrandLogoProps = {
  size?: BrandLogoSize;
  variant?: "plain" | "soft";
  className?: string;
};

const sizeClasses: Record<"small" | "medium" | "large" | "hero", string> = {
  small: "max-h-10 max-w-[130px]",
  medium: "max-h-16 max-w-[190px]",
  large: "max-h-24 max-w-[260px]",
  hero: "max-h-32 max-w-[320px]",
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
  const isSvg = src.endsWith(".svg");

  const image = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt="Flemströms"
      className={cn(
        sizeClass,
        "h-auto w-auto object-contain",
        !isSvg && "mix-blend-multiply"
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

  if (variant === "soft") {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center rounded-[2rem] bg-gradient-to-b from-[#FBF7F1] to-[#F5EDE3] px-6 py-4",
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
