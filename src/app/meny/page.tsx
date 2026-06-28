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

const viktigtItems = [
  { href: "/installera", label: "Installera som app", subtitle: "Lägg på hemskärmen", icon: Smartphone, color: "bg-primaryLight text-primary" },
  { href: "/meny", label: "Exportera backup", subtitle: "Spara en kopia", icon: Download, color: "bg-flemstromBlueLight text-flemstromBlue", action: "export" as const },
  { href: "/kontakter", label: "Snabbkontakter", subtitle: "Ring och maila", icon: UsersRound, color: "bg-successLight text-success" },
];

const verktygItems = [
  { href: "/support", label: "Support & hjälp", subtitle: "Få hjälp", icon: CircleHelp, color: "bg-primaryLight text-primary" },
  { href: "/ai", label: "Fråga Jobbminne AI", subtitle: "Skriv texter", icon: Sparkles, color: "bg-aiPurpleLight text-aiPurple" },
  { href: "/anteckningar", label: "Anteckningar", subtitle: "Spara noteringar", icon: StickyNote, color: "bg-primaryLight text-primaryDark" },
  { href: "/miniraknare", label: "Miniräknare", subtitle: "Timmar & mått", icon: Calculator, color: "bg-utilityCyanLight text-utilityCyan" },
  { href: "/fordon", label: "Fordon & personal", subtitle: "Dagsrapporter", icon: Truck, color: "bg-flemstromBlueLight text-flemstromBlue" },
  { href: "/status", label: "Att kolla", subtitle: "Se vad som saknas", icon: CheckCircle2, color: "bg-successLight text-success" },
  { href: "/kalender", label: "Kalender", subtitle: "Jobb per dag", icon: Calendar, color: "bg-flemstromBlueLight text-flemstromBlueDark" },
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
      <div className="flex flex-col items-center pb-3 pt-2 text-center">
        <BrandLogo size="large" className="mb-4" />
        <h1 className="text-2xl font-extrabold tracking-tight text-text">Jobbminne</h1>
        <p className="mt-0.5 font-semibold text-flemstromBlue">Flemströms</p>
        <p className="text-sm text-muted">Intern arbetsapp</p>
      </div>

      {backupWarning && (
        <Card className="mt-4 border-warning/30 bg-warning/10">
          <p className="text-sm text-text">{backupWarning}</p>
        </Card>
      )}

      <section className="mt-6">
        <SectionTitle>Viktigt</SectionTitle>
        <div className="space-y-2">
          {viktigtItems.map((item) =>
            item.action === "export" ? (
              <button key={item.label} type="button" onClick={downloadBackup} className="w-full">
                <MenuRow {...item} href={item.href} />
              </button>
            ) : (
              <MenuRow key={item.href} {...item} />
            )
          )}
        </div>
      </section>

      <section className="mt-6">
        <SectionTitle>Verktyg</SectionTitle>
        <div className="space-y-2">
          {verktygItems.map((item) => (
            <MenuRow key={item.href} {...item} />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <SectionTitle>Data</SectionTitle>
        <div className="space-y-2">
          <button type="button" onClick={() => setShowArchived(!showArchived)} className="w-full">
            <Card interactive className="flex items-center gap-3 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-muted">
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
          <button type="button" onClick={() => fileRef.current?.click()} className="w-full">
            <Card interactive className="flex items-center gap-3 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-flemstromBlueLight text-flemstromBlue">
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

      <section className="mt-6">
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
  const inner = (
    <Card interactive className="flex items-center gap-3 py-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
    </Card>
  );

  if (href === "/meny") return inner;

  return <Link href={href}>{inner}</Link>;
}
