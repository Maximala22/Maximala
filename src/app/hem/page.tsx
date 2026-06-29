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
} from "lucide-react";
import { getUserName } from "@/lib/storage";
import { getTodaysWorkLogs, getTotalHoursForDate } from "@/lib/fleetStorage";
import { getActiveJobs, getTodaysJobs } from "@/lib/storage";
import {
  getGreeting,
  formatDate,
  capitalizeFirst,
  todayISO,
} from "@/lib/utils";
import { getStatusSummary } from "@/lib/aiStatus";
import { appConfig } from "@/lib/appConfig";
import { isDemoActive } from "@/lib/demoData";
import ActionCard from "@/components/ActionCard";
import Card from "@/components/Card";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";

export default function HemPage() {
  const [userName, setUser] = useState("");
  const today = todayISO();
  const status = getStatusSummary();

  useEffect(() => {
    setUser(getUserName() ?? "");
  }, []);

  const todaysJobs = getTodaysJobs();
  const todaysLogs = getTodaysWorkLogs();
  const totalHours = getTotalHoursForDate(today);
  const allJobs = getActiveJobs();

  return (
    <PageContainer>
      {appConfig.showCompanyBranding && (
        <p className="label-upper text-flemstromBlue">{appConfig.companyName}</p>
      )}
      <p className="mt-2 text-base text-muted">{getGreeting()},</p>
      <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight">
        {userName || "Välkommen"}
      </h1>
      <p className="mt-1 text-sm font-medium text-muted">
        {capitalizeFirst(formatDate(new Date()))}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{appConfig.subtitle}</p>

      {isDemoActive() && (
        <p className="mt-2 rounded-xl bg-note-light px-3 py-2 text-xs font-medium text-note-dark">
          Demoläge aktivt — exempeldata visas.
        </p>
      )}

      {/* 1. Skapa jobb */}
      <div className="mt-5">
        <ActionCard
          variant="primary"
          size="hero"
          title="Skapa jobb"
          subtitle="Samla jobb, bilder och anteckningar"
          icon={Plus}
          href="/jobb/ny"
        />
      </div>

      {/* 2. Dagsrapport */}
      <div className="mt-3">
        <ActionCard
          variant="report"
          size="md"
          title="Lägg dagsrapport"
          subtitle="Timmar, fordon och vad som gjorts"
          icon={ClipboardList}
          href={`/fordon/ny?date=${today}`}
        />
      </div>

      {/* 3. Dagens fokus */}
      <section className="mt-5">
        <SectionTitle>Dagens fokus</SectionTitle>
        <Card className="p-4">
          <p className="text-base font-semibold text-text">
            {todaysJobs.length} jobb · {todaysLogs.length} rapport
            {todaysLogs.length !== 1 ? "er" : ""} · {totalHours} h
          </p>

          {allJobs.length === 0 ? (
            <div className="mt-3">
              <p className="text-sm text-muted">
                Skapa ditt första jobb och samla rapporter, bilder och timmar på ett ställe.
              </p>
              <Link
                href="/jobb/ny"
                className="mt-3 inline-flex min-h-[44px] items-center rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-warm active:scale-[0.98]"
              >
                Skapa jobb
              </Link>
            </div>
          ) : (
            <div className="mt-3 space-y-1.5">
              {todaysJobs.slice(0, 2).map((j) => (
                <Link
                  key={j.id}
                  href={`/jobb/${j.id}`}
                  className="flex items-center justify-between rounded-xl bg-background px-3 py-2.5 active:scale-[0.99]"
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
          )}
        </Card>
      </section>

      {/* 4. Snabbkontakter */}
      <div className="mt-3">
        <ActionCard
          variant="success"
          size="md"
          title="Snabbkontakter"
          subtitle="Ring och maila snabbt"
          icon={UsersRound}
          href="/kontakter"
        />
      </div>

      {/* 5. Kalender & status */}
      <section className="mt-5">
        <SectionTitle>Kalender & status</SectionTitle>
        <div className="space-y-2">
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
          <Link href="/status">
            <Card
              interactive
              className={`flex items-center gap-3 p-3.5 ${
                status.allGood
                  ? "border-success/15 bg-successLight/70"
                  : "border-warning/20 bg-warning-light"
              }`}
            >
              {status.allGood ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
              ) : (
                <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">{status.summaryText}</p>
                {!status.allGood && status.items[0] && (
                  <p className="mt-0.5 text-xs text-muted line-clamp-1">
                    {status.items[0].message}
                  </p>
                )}
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
            </Card>
          </Link>
        </div>
      </section>

      {/* 6. Verktyg — bonus, längre ner */}
      <section className="mt-5 mb-2">
        <SectionTitle>Verktyg</SectionTitle>
        <p className="mb-2 text-xs text-muted">Extra hjälpmedel — inte nödvändiga för vardagen.</p>
        <Card className="divide-y divide-border p-0">
          <ToolLink href="/anteckningar" icon={StickyNote} label="Anteckningar" />
          <ToolLink href="/ai" icon={Sparkles} label="Hjälp att skriva texter" />
          <ToolLink href="/miniraknare" icon={Calculator} label="Miniräknare" />
          <ToolLink href="/support" icon={CircleHelp} label="Support" />
        </Card>
      </section>
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
