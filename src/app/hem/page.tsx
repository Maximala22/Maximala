"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UsersRound,
  Mail,
  CircleHelp,
  Sparkles,
  Calculator,
  ChevronRight,
  Plus,
  StickyNote,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Shield,
} from "lucide-react";
import { getUserName } from "@/lib/storage";
import { getTodaysWorkLogs, getTotalHoursForDate } from "@/lib/fleetStorage";
import { getActiveJobs, getTodaysJobs } from "@/lib/storage";
import {
  getGreeting,
  formatDate,
  capitalizeFirst,
  todayISO,
  openOutlook,
} from "@/lib/utils";
import { getOperationalSummary, getBackupHint } from "@/lib/aiStatus";
import ActionCard from "@/components/ActionCard";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";

export default function HemPage() {
  const [userName, setUser] = useState("");
  const today = todayISO();
  const operational = getOperationalSummary();
  const backupHint = getBackupHint();

  useEffect(() => {
    setUser(getUserName() ?? "");
  }, []);

  const todaysJobs = getTodaysJobs();
  const todaysLogs = getTodaysWorkLogs();
  const totalHours = getTotalHoursForDate(today);
  const allJobs = getActiveJobs();

  return (
    <PageContainer>
      <p className="label-upper text-flemstromBlue">Flemströms</p>
      <p className="mt-2 text-base text-muted">{getGreeting()},</p>
      <h1 className="text-[2rem] font-extrabold leading-tight tracking-tight">
        {userName || "Välkommen"}
      </h1>
      <p className="mt-1 text-sm font-medium text-muted">
        {capitalizeFirst(formatDate(new Date()))}
      </p>

      {/* 1. Huvudaction */}
      <div className="mt-5">
        <ActionCard
          variant="primary"
          size="hero"
          title="Skapa jobb"
          subtitle="Nytt jobb ute på fältet"
          icon={Plus}
          href="/jobb/ny"
        />
      </div>

      {/* 2–3. Rapport + anteckning */}
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <ActionCard
          variant="report"
          size="md"
          title="Lägg rapport"
          subtitle="Dagsrapport"
          icon={ClipboardList}
          href="/fordon"
        />
        <ActionCard
          variant="note"
          size="md"
          title="Ny anteckning"
          subtitle="Text & bilder"
          icon={StickyNote}
          href="/anteckningar"
        />
      </div>

      {/* 4. Snabbkontakter */}
      <div className="mt-3">
        <ActionCard
          variant="success"
          size="md"
          title="Snabbkontakter"
          subtitle="Ring, SMS och mail"
          icon={UsersRound}
          href="/kontakter"
        />
      </div>

      {/* 5. Dagens fokus */}
      <section className="mt-5">
        <SectionTitle>Dagens fokus</SectionTitle>
        <Card className="p-4">
          <p className="text-base font-semibold text-text">
            {todaysJobs.length} jobb idag · {todaysLogs.length} rapport
            {todaysLogs.length !== 1 ? "er" : ""} · {totalHours} h
          </p>

          {allJobs.length === 0 ? (
            <p className="mt-2 text-sm text-muted">
              Du har inga jobb ännu. Börja med att skapa ett jobb.
            </p>
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

      {/* Övriga genvägar */}
      <section className="mt-5">
        <SectionTitle>Snabbt</SectionTitle>
        <div className="grid grid-cols-2 gap-2.5">
          <ActionCard
            variant="info"
            size="sm"
            title="Outlook"
            subtitle="Öppna mail"
            icon={Mail}
            onClick={openOutlook}
          />
          <ActionCard
            variant="ai"
            size="sm"
            title="Fråga AI"
            subtitle="Skriv texter"
            icon={Sparkles}
            href="/ai"
          />
          <ActionCard
            variant="utility"
            size="sm"
            title="Räknare"
            subtitle="Timmar & mått"
            icon={Calculator}
            href="/miniraknare"
          />
          <ActionCard
            variant="neutral"
            size="sm"
            title="Support"
            subtitle="Få hjälp"
            icon={CircleHelp}
            href="/support"
          />
        </div>
      </section>

      {/* 6. Status — diskret */}
      <section className="mt-5 mb-2">
        <SectionTitle>Status</SectionTitle>
        <Link href="/status">
          <Card
            interactive
            className={`flex items-center gap-3 p-3.5 ${
              operational.allGood
                ? "border-success/15 bg-successLight/70"
                : "border-warning/20 bg-warning-light"
            }`}
          >
            {operational.allGood ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-text">{operational.summaryText}</p>
              {!operational.allGood && operational.items[0] && (
                <p className="mt-0.5 text-xs text-muted line-clamp-1">
                  {operational.items[0].message}
                </p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
          </Card>
        </Link>

        {backupHint && (
          <Link href="/meny" className="mt-2 block">
            <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-muted active:bg-background">
              <Shield className="h-3.5 w-3.5 shrink-0 text-flemstromBlue" />
              <span>{backupHint}</span>
              <ChevronRight className="ml-auto h-3.5 w-3.5" />
            </div>
          </Link>
        )}
      </section>
    </PageContainer>
  );
}
