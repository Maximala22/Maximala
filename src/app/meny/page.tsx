"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UsersRound,
  CircleHelp,
  Sparkles,
  StickyNote,
  Calculator,
  Truck,
  CheckCircle2,
  Calendar,
  Archive,
  Download,
  Upload,
  LogOut,
  ChevronRight,
  Smartphone,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { clearUser, getArchivedJobs } from "@/lib/storage";
import { downloadBackup, importBackup, getBackupWarning } from "@/lib/backup";

const toolItems = [
  { href: "/installera", label: "Installera som app", subtitle: "Lägg Jobbminne på hemskärmen", icon: Smartphone, color: "bg-primary/10 text-primary" },
  { href: "/kontakter", label: "Snabbkontakter", subtitle: "Ring och maila", icon: UsersRound, color: "bg-emerald-100 text-emerald-700" },
  { href: "/support", label: "Support & hjälp", subtitle: "Få hjälp", icon: CircleHelp, color: "bg-orange-100 text-primary" },
  { href: "/ai", label: "Fråga Jobbminne AI", subtitle: "Skriv texter", icon: Sparkles, color: "bg-purple-100 text-purple-700" },
  { href: "/anteckningar", label: "Anteckningar", subtitle: "Spara noteringar", icon: StickyNote, color: "bg-amber-100 text-amber-700" },
  { href: "/miniraknare", label: "Miniräknare", subtitle: "Timmar & mått", icon: Calculator, color: "bg-cyan-100 text-cyan-700" },
  { href: "/fordon", label: "Fordon & personal", subtitle: "Dagsrapporter", icon: Truck, color: "bg-blue-100 text-flemstromBlue" },
  { href: "/status", label: "Att kolla", subtitle: "Se vad som saknas", icon: CheckCircle2, color: "bg-green-100 text-green-700" },
  { href: "/kalender", label: "Kalender", subtitle: "Jobb per dag", icon: Calendar, color: "bg-sky-100 text-sky-700" },
];

export default function MenyPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const backupWarning = getBackupWarning();
  const archived = getArchivedJobs();

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        const result = importBackup(json);
        setImportMsg(result.success ? "Backup importerad!" : result.error ?? "Fel vid import");
      } catch {
        setImportMsg("Ogiltig fil");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <PageContainer>
      <div className="flex flex-col items-center pb-3 pt-3 text-center">
        <BrandLogo size="large" className="mb-4" />
        <h1 className="text-2xl font-bold tracking-tight text-text">Jobbminne</h1>
        <p className="mt-0.5 font-medium text-flemstromBlue">Flemströms</p>
        <p className="text-sm text-muted">Intern arbetsapp</p>
      </div>

      {backupWarning && (
        <Card className="mt-5 border-amber-200/80 bg-amber-50">
          <p className="text-sm text-amber-900">{backupWarning}</p>
        </Card>
      )}

      <Card className="mt-4 border-border/80 bg-background/60">
        <p className="text-sm leading-relaxed text-muted">
          Jobb och bilder sparas lokalt på den här enheten. Exportera backup regelbundet.
        </p>
      </Card>

      <section className="mt-8">
        <SectionTitle>Verktyg</SectionTitle>
        <div className="space-y-2">
          {toolItems.map((item) => (
            <MenuRow key={item.href} {...item} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionTitle>Data</SectionTitle>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className="w-full"
          >
            <Card interactive className="flex items-center gap-3 py-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-600">
                <Archive className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Visa arkiverade jobb</p>
                <p className="text-sm text-muted">{archived.length} arkiverade</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted" />
            </Card>
          </button>
          {showArchived && (
            <Card className="mt-1">
              {archived.length === 0 ? (
                <p className="text-sm text-muted">Inga arkiverade jobb.</p>
              ) : (
                archived.map((j) => (
                  <Link
                    key={j.id}
                    href={`/jobb/${j.id}`}
                    className="block border-b border-border py-2.5 text-sm font-medium last:border-0"
                  >
                    {j.title}
                  </Link>
                ))
              )}
            </Card>
          )}
          <button type="button" onClick={downloadBackup} className="w-full">
            <Card interactive className="flex items-center gap-3 py-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-flemstromBlue">
                <Download className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Exportera backup</p>
                <p className="text-sm text-muted">Spara en kopia</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted" />
            </Card>
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="w-full">
            <Card interactive className="flex items-center gap-3 py-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Upload className="h-5 w-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Importera backup</p>
                <p className="text-sm text-muted">Återställ från fil</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted" />
            </Card>
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          {importMsg && (
            <p className="pt-1 text-center text-sm font-medium text-primary">{importMsg}</p>
          )}
        </div>
      </section>

      <section className="mt-8">
        <SectionTitle>Konto</SectionTitle>
        <Button
          fullWidth
          variant="secondary"
          className="flex items-center justify-center gap-2"
          onClick={() => {
            clearUser();
            router.push("/login");
          }}
        >
          <LogOut className="h-4 w-4" />
          Logga ut
        </Button>
      </section>
    </PageContainer>
  );
}

function MenuRow({
  href,
  label,
  subtitle,
  icon: Icon,
  color,
}: {
  href: string;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <Link href={href}>
      <Card interactive className="flex items-center gap-3 py-3.5">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-muted">{subtitle}</p>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
      </Card>
    </Link>
  );
}
