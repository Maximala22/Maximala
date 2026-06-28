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
  Truck,
  StickyNote,
  ClipboardList,
} from "lucide-react";
import { getUserName } from "@/lib/storage";
import { getTodaysWorkLogs, getTotalHoursForDate } from "@/lib/fleetStorage";
import { getActiveJobs, getTodaysJobs } from "@/lib/storage";
import {
  getGreeting,
  formatDate,
  formatTime,
  capitalizeFirst,
  todayISO,
  openOutlook,
} from "@/lib/utils";
import AIStatusCard from "@/components/AIStatusCard";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";

export default function HemPage() {
  const [time, setTime] = useState("");
  const [userName, setUser] = useState("");
  const today = todayISO();

  useEffect(() => {
    setUser(getUserName() ?? "");
    setTime(formatTime());
    const interval = setInterval(() => setTime(formatTime()), 30000);
    return () => clearInterval(interval);
  }, []);

  const todaysJobs = getTodaysJobs();
  const ongoingJobs = getActiveJobs().filter((j) => j.status === "Pågående");
  const followUpJobs = getActiveJobs().filter((j) => j.status === "Uppföljning");
  const todaysLogs = getTodaysWorkLogs();
  const totalHours = getTotalHoursForDate(today);
  const allJobs = getActiveJobs();

  return (
    <PageContainer>
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-flemstromBlue">
        Flemströms
      </p>
      <p className="mt-2 text-muted">{getGreeting()},</p>
      <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight">
        {userName || "Välkommen"}
      </h1>

      <div className="my-4 text-center">
        <p className="text-[2rem] font-extrabold leading-none tracking-tight">{time}</p>
        <p className="mt-1 text-sm text-muted">
          {capitalizeFirst(formatDate(new Date()))}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2.5">
        <PrimaryAction
          href="/jobb/ny"
          label="Skapa jobb"
          icon={Plus}
          className="bg-gradient-to-br from-primary to-primaryDark"
        />
        <AIStatusCard compact />
        <PrimaryAction
          href="/fordon"
          label="Lägg rapport"
          icon={ClipboardList}
          className="bg-gradient-to-br from-primaryDark to-[#8B4018]"
        />
        <PrimaryAction
          href="/anteckningar"
          label="Ny anteckning"
          icon={StickyNote}
          className="bg-gradient-to-br from-primary to-primaryDark"
        />
      </div>

      <section className="mb-5">
        <SectionTitle>Dagens fokus</SectionTitle>
        <Card>
          {allJobs.length === 0 ? (
            <div className="py-5 text-center">
              <p className="text-muted">Du har inga jobb idag.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Link href="/jobb/ny">
                  <Button size="sm">Skapa jobb</Button>
                </Link>
                <Link href="/fordon">
                  <Button size="sm" variant="secondary">Lägg rapport</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted">
                {todaysJobs.length} jobb idag · {todaysLogs.length} rapport
                {todaysLogs.length !== 1 ? "er" : ""} · {totalHours} h
              </p>
              {todaysJobs.length > 0 && (
                <JobGroup title="Dagens jobb">
                  {todaysJobs.slice(0, 3).map((j) => (
                    <JobRow key={j.id} href={`/jobb/${j.id}`} title={j.title} sub={j.customerName} />
                  ))}
                </JobGroup>
              )}
              {ongoingJobs.length > 0 && (
                <JobGroup title="Pågående">
                  {ongoingJobs.slice(0, 2).map((j) => (
                    <JobRow key={j.id} href={`/jobb/${j.id}`} title={j.title} />
                  ))}
                </JobGroup>
              )}
              {followUpJobs.length > 0 && (
                <JobGroup title="Uppföljning">
                  {followUpJobs.slice(0, 2).map((j) => (
                    <JobRow key={j.id} href={`/jobb/${j.id}`} title={j.title} />
                  ))}
                </JobGroup>
              )}
              {todaysLogs.length > 0 && (
                <JobGroup title="Dagens rapporter">
                  {todaysLogs.slice(0, 3).map((l) => (
                    <div key={l.id} className="rounded-xl bg-background px-3 py-2 text-sm">
                      {l.driverName} · {l.hours ?? "–"} h
                    </div>
                  ))}
                </JobGroup>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <Link href="/jobb/ny">
                  <Button size="sm">Skapa jobb</Button>
                </Link>
                <Link href="/fordon">
                  <Button size="sm" variant="secondary">Lägg rapport</Button>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </section>

      <Link href="/fordon" className="mb-5 block">
        <Card interactive className="flex items-center gap-3 py-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-blue-50 text-flemstromBlue">
            <Truck className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {todaysLogs.length === 0
                ? "0 rapporter idag"
                : `${todaysLogs.length} rapport${todaysLogs.length > 1 ? "er" : ""} · ${totalHours} h`}
            </p>
            <p className="text-sm text-muted">Fordon & personal</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
        </Card>
      </Link>

      <section className="mb-4">
        <SectionTitle>Snabba kanaler</SectionTitle>

        <Link
          href="/kontakter"
          className="mb-3 flex items-center gap-3 rounded-[1.25rem] bg-gradient-to-r from-success to-[#128A52] p-4 text-white shadow-lift transition active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <UsersRound className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold">Snabbkontakter</p>
            <p className="text-sm text-white/85">Ring, SMS och mail</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 opacity-80" />
        </Link>

        <div className="grid grid-cols-2 gap-2.5">
          <QuickCard
            title="Outlook"
            subtitle="Öppna mail"
            icon={Mail}
            className="bg-gradient-to-br from-flemstromBlue to-flemstromBlueDark"
            onClick={openOutlook}
          />
          <QuickCard
            title="Fråga AI"
            subtitle="Skriv mejl & SMS"
            icon={Sparkles}
            className="bg-gradient-to-br from-aiPurple to-[#6D28D9]"
            href="/ai"
          />
          <QuickCard
            title="Räknare"
            subtitle="Timmar & mått"
            icon={Calculator}
            className="bg-gradient-to-br from-utilityCyan to-[#0D8A8C]"
            href="/miniraknare"
          />
          <QuickCard
            title="Support"
            subtitle="Få hjälp"
            icon={CircleHelp}
            className="bg-gradient-to-br from-primary to-primaryDark"
            href="/support"
          />
        </div>
      </section>

      <p className="pb-2 pt-1 text-center text-xs leading-relaxed text-muted">
        Data sparas lokalt · Exportera backup i Meny
      </p>
    </PageContainer>
  );
}

function PrimaryAction({
  href,
  label,
  icon: Icon,
  className,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  className: string;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-[104px] flex-col justify-between rounded-[1.15rem] p-3.5 text-white shadow-card transition active:scale-[0.98] ${className}`}
    >
      <Icon className="h-6 w-6 opacity-90" strokeWidth={2} />
      <span className="text-[15px] font-semibold leading-snug">{label}</span>
    </Link>
  );
}

function JobGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function JobRow({ href, title, sub }: { href: string; title: string; sub?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl bg-background px-3 py-2 transition active:scale-[0.99]"
    >
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {sub && <p className="text-xs text-muted">{sub}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted" />
    </Link>
  );
}

function QuickCard({
  title,
  subtitle,
  icon: Icon,
  className,
  href,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  className: string;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <p className="text-sm font-bold leading-tight">{title}</p>
      <p className="mt-0.5 text-[11px] text-white/80">{subtitle}</p>
    </>
  );

  const cardClass = `flex min-h-[96px] flex-col justify-end rounded-[1.15rem] p-3.5 text-white shadow-card transition active:scale-[0.97] ${className}`;

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${cardClass} text-left`}>
      {inner}
    </button>
  );
}
