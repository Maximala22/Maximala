import BrandLogo from "./BrandLogo";

type LogoProps = {
  size?: "small" | "medium" | "large" | "sm" | "md" | "lg";
  variant?: "plain" | "soft";
  className?: string;
};

export default function Logo({ size = "md", variant, className }: LogoProps) {
  return <BrandLogo size={size} variant={variant} className={className} />;
}
