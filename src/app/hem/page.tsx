"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UsersRound,
  CircleHelp,
  Sparkles,
  Calculator,
  ChevronRight,
  Plus,
  StickyNote,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Download,
} from "lucide-react";
import { getUserName, getLastBackupAt } from "@/lib/storage";
import { getTodaysWorkLogs, getTotalHoursForDate } from "@/lib/fleetStorage";
import { getActiveJobs, getTodaysJobs } from "@/lib/storage";
import {
  getGreeting,
  formatDate,
  capitalizeFirst,
  todayISO,
} from "@/lib/utils";
import { getStatusSummary } from "@/lib/aiStatus";
import { downloadBackup } from "@/lib/backup";
import { appConfig } from "@/lib/appConfig";
import { isDemoActive } from "@/lib/demoData";
import ActionCard from "@/components/ActionCard";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import Toast from "@/components/Toast";

function reportCountLabel(count: number): string {
  if (count === 1) return "1 rapport";
  return `${count} rapporter`;
}

export default function HemPage() {
  const [userName, setUser] = useState("");
  const [toast, setToast] = useState("");
  const today = todayISO();
  const status = getStatusSummary();
  const lastBackup = getLastBackupAt();
  const needsBackup = status.items.some(
    (i) => i.id === "no-backup" || i.id === "old-backup"
  );

  useEffect(() => {
    setUser(getUserName() ?? "");
  }, []);

  const todaysJobs = getTodaysJobs();
  const todaysLogs = getTodaysWorkLogs();
  const totalHours = getTotalHoursForDate(today);
  const allJobs = getActiveJobs();
  const nothingToday = todaysJobs.length === 0 && todaysLogs.length === 0;
  const isEmptyApp = allJobs.length === 0 && todaysLogs.length === 0;
  const greeting = getGreeting();

  const handleExportBackup = () => {
    downloadBackup();
    setToast("Backup exporterad");
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <PageContainer>
      {appConfig.showCompanyBranding && (
        <p className="label-upper text-flemstromBlue">{appConfig.companyName}</p>
      )}

      {userName ? (
        <>
          <p className="mt-2 text-base text-muted">{greeting},</p>
          <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight">{userName}</h1>
        </>
      ) : (
        <>
          <p className="mt-2 text-base text-muted">{greeting}</p>
          <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight">
            Välkommen tillbaka
          </h1>
        </>
      )}

      <p className="mt-1 text-sm font-medium text-muted">
        {capitalizeFirst(formatDate(new Date()))}
      </p>

      {isDemoActive() && (
        <p className="mt-2 rounded-xl bg-note-light px-3 py-2 text-xs font-medium text-note-dark">
          Demoläge aktivt — exempeldata visas.
        </p>
      )}

      <div className="mt-5">
        <ActionCard
          variant="primary"
          size="hero"
          title="Skapa jobb"
          subtitle="Nytt arbete ute på fältet"
          icon={Plus}
          href="/jobb/ny"
        />
      </div>

      <div className="mt-3">
        <ActionCard
          variant="report"
          size="md"
          title="Lägg dagsrapport"
          subtitle="Skriv vad som gjorts idag"
          icon={ClipboardList}
          href={`/dagsrapport/ny?date=${today}`}
        />
      </div>

      <section className="mt-5">
        <SectionTitle>Dagens fokus</SectionTitle>
        <Card className="p-4">
          {isEmptyApp ? (
            <>
              <p className="font-semibold text-text">Inget registrerat idag</p>
              <p className="mt-2 text-sm text-muted">
                Skapa ett jobb eller lägg en dagsrapport när arbetet är klart.
              </p>
              <p className="mt-2 text-xs text-muted">Börja med knapparna ovanför.</p>
            </>
          ) : nothingToday ? (
            <>
              <p className="font-semibold text-text">Inget registrerat idag</p>
              <p className="mt-1 text-sm text-muted">
                {allJobs.length} jobb totalt · {reportCountLabel(0)} · {totalHours} h
              </p>
              <p className="mt-2 text-sm text-muted">
                Lägg dagens första rapport när arbetet är klart.
              </p>
              <Link href={`/dagsrapport/ny?date=${today}`} className="mt-3 inline-block">
                <Button variant="secondary" size="sm">
                  Lägg rapport
                </Button>
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm text-muted">
                {todaysJobs.length} jobb · {reportCountLabel(todaysLogs.length)} · {totalHours} h
              </p>
              <div className="mt-3 space-y-1.5">
                {todaysJobs.slice(0, 2).map((j) => (
                  <Link
                    key={j.id}
                    href={`/jobb/${j.id}`}
                    className="flex items-center justify-between rounded-xl bg-background px-3 py-2.5 active:bg-background/80"
                  >
                    <span className="text-sm font-semibold">{j.title}</span>
                    <ChevronRight className="h-4 w-4 text-muted" />
                  </Link>
                ))}
                {todaysLogs.slice(0, 2).map((l) => (
                  <div key={l.id} className="rounded-xl bg-background px-3 py-2 text-sm text-muted">
                    {l.driverName} · {l.hours ?? "–"} h
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </section>

      <div className="mt-3">
        <ActionCard
          variant="success"
          size="md"
          title="Snabbkontakter"
          subtitle="Ring kontor eller personal"
          icon={UsersRound}
          href="/kontakter"
        />
      </div>

      <section className="mt-5">
        <SectionTitle>Planering</SectionTitle>
        <Link href="/kalender">
          <Card interactive className="flex items-center gap-3 p-3.5">
            <Calendar className="h-5 w-5 shrink-0 text-flemstromBlue" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Kalender</p>
              <p className="text-xs text-muted">Se jobb och rapporter per dag</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted" />
          </Card>
        </Link>
      </section>

      <section className="mt-5">
        <SectionTitle>Status</SectionTitle>
        <Card
          className={`p-4 ${
            status.allGood
              ? "border-success/15 bg-successLight/70"
              : "border-warning/20 bg-warning-light"
          }`}
        >
          <div className="flex items-start gap-3">
            {status.allGood ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{status.summaryText}</p>
              {!status.allGood && status.items[0] && (
                <p className="mt-0.5 text-xs text-muted">{status.items[0].message}</p>
              )}
              {status.allGood && (
                <p className="mt-0.5 text-xs text-muted">Data sparas på denna telefon.</p>
              )}
              {lastBackup ? (
                <p className="mt-1 text-xs text-muted">
                  Senaste backup:{" "}
                  {new Date(lastBackup).toLocaleDateString("sv-SE", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted">Senaste backup: aldrig</p>
              )}
            </div>
          </div>

          {needsBackup && (
            <Button
              fullWidth
              variant="secondary"
              size="sm"
              className="mt-3 gap-2"
              onClick={handleExportBackup}
            >
              <Download className="h-4 w-4" />
              Exportera backup
            </Button>
          )}

          {!needsBackup && !status.allGood && (
            <Link href="/status" className="mt-3 block">
              <Button fullWidth variant="secondary" size="sm">
                Se vad som saknas
              </Button>
            </Link>
          )}

          {status.allGood && !needsBackup && (
            <Link href="/status" className="mt-3 block text-center text-xs font-medium text-primary">
              Visa status
            </Link>
          )}
        </Card>
      </section>

      <section className="mt-5 mb-2">
        <SectionTitle>Verktyg</SectionTitle>
        <p className="mb-2 text-xs text-muted">Saker som hjälper när du behöver dem.</p>
        <Card className="divide-y divide-border p-0">
          <ToolLink href="/anteckningar" icon={StickyNote} label="Anteckningar" />
          <ToolLink href="/ai" icon={Sparkles} label="Hjälp att skriva texter" />
          <ToolLink href="/miniraknare" icon={Calculator} label="Miniräknare" />
          <ToolLink href="/support" icon={CircleHelp} label="Support" />
        </Card>
      </section>

      <Toast message={toast} visible={!!toast} />
    </PageContainer>
  );
}

function ToolLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 px-4 py-3.5 active:bg-background">
        <Icon className="h-5 w-5 text-muted" />
        <span className="flex-1 text-sm font-semibold">{label}</span>
        <ChevronRight className="h-4 w-4 text-muted" />
      </div>
    </Link>
  );
}
