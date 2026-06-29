import Link from "next/link";
import { cn } from "@/lib/utils";
import { appConfig } from "@/lib/appConfig";

type HeaderProps = {
  title?: string;
  subtitle?: string;
  brand?: boolean;
  backHref?: string;
  className?: string;
};

export default function Header({ title, subtitle, brand, backHref, className }: HeaderProps) {
  return (
    <header className={cn("pt-1", className)}>
      {backHref && (
        <Link href={backHref} className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
          ← Tillbaka
        </Link>
      )}
      {brand && appConfig.showCompanyBranding && (
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-flemstromBlue">
          {appConfig.companyName}
        </p>
      )}
      {title && <h1 className="text-2xl font-bold tracking-tight text-text">{title}</h1>}
      {subtitle && <p className="mt-1 text-sm leading-relaxed text-muted">{subtitle}</p>}
    </header>
  );
}
