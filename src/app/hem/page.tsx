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
      <p className="mt-3 text-muted">{getGreeting()},</p>
      <h1 className="text-[2rem] font-bold leading-tight tracking-tight">
        {userName || "Välkommen"}
      </h1>

      <div className="my-8 text-center">
        <p className="text-[3.25rem] font-bold leading-none tracking-tight">{time}</p>
        <p className="mt-2 text-base text-muted">
          {capitalizeFirst(formatDate(new Date()))}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3">
        <Link
          href="/jobb/ny"
          className="flex min-h-[148px] flex-col justify-between rounded-[1.25rem] bg-gradient-to-br from-primary to-primaryDark p-4 text-white shadow-warm transition active:scale-[0.98]"
        >
          <Plus className="h-7 w-7 opacity-90" strokeWidth={2} />
          <span className="text-lg font-semibold leading-snug">Skapa jobb</span>
        </Link>
        <AIStatusCard compact />
      </div>

      <section className="mb-8">
        <SectionTitle>Dagens fokus</SectionTitle>
        <Card>
          {allJobs.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-muted">Inga jobb ännu. Skapa ditt första jobb.</p>
              <Link href="/jobb/ny" className="mt-5 inline-block">
                <Button>+ Skapa jobb</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {todaysJobs.length > 0 && (
                <JobGroup title="Dagens jobb">
                  {todaysJobs.map((j) => (
                    <JobRow key={j.id} href={`/jobb/${j.id}`} title={j.title} sub={j.customerName} />
                  ))}
                </JobGroup>
              )}
              {ongoingJobs.length > 0 && (
                <JobGroup title="Pågående">
                  {ongoingJobs.slice(0, 3).map((j) => (
                    <JobRow key={j.id} href={`/jobb/${j.id}`} title={j.title} />
                  ))}
                </JobGroup>
              )}
              {followUpJobs.length > 0 && (
                <JobGroup title="Uppföljning">
                  {followUpJobs.slice(0, 3).map((j) => (
                    <JobRow key={j.id} href={`/jobb/${j.id}`} title={j.title} />
                  ))}
                </JobGroup>
              )}
              {todaysLogs.length > 0 && (
                <JobGroup title="Dagens rapporter">
                  {todaysLogs.map((l) => (
                    <div key={l.id} className="rounded-xl bg-background px-3 py-2.5 text-sm">
                      {l.driverName} · {l.hours ?? "–"} h
                    </div>
                  ))}
                </JobGroup>
              )}
            </div>
          )}
        </Card>
      </section>

      <Link href="/fordon" className="mb-8 block">
        <Card interactive className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-blue-50 text-flemstromBlue">
            <Truck className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              {todaysLogs.length === 0
                ? "0 rapporter idag"
                : `${todaysLogs.length} rapport${todaysLogs.length > 1 ? "er" : ""} idag · ${totalHours} h`}
            </p>
            <p className="text-sm text-muted">Fordon & personal</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
        </Card>
      </Link>

      <section className="mb-6">
        <SectionTitle>Snabba kanaler</SectionTitle>

        <Link
          href="/kontakter"
          className="mb-4 flex items-center gap-4 rounded-[1.5rem] bg-gradient-to-r from-emerald-600 via-green-600 to-green-500 p-5 text-white shadow-lift transition active:scale-[0.98]"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <UsersRound className="h-7 w-7" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold">Snabbkontakter</p>
            <p className="text-sm text-white/85">Ring, SMS, WhatsApp och mail</p>
          </div>
          <ChevronRight className="h-6 w-6 shrink-0 opacity-80" />
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <QuickCard
            title="Outlook"
            subtitle="Öppna mail"
            icon={Mail}
            gradient="from-blue-600 to-blue-500"
            onClick={openOutlook}
          />
          <QuickCard
            title="Support"
            subtitle="Få hjälp"
            icon={CircleHelp}
            gradient="from-primary to-primaryDark"
            href="/support"
          />
          <QuickCard
            title="Fråga AI"
            subtitle="Skriv mejl & SMS"
            icon={Sparkles}
            gradient="from-violet-600 to-purple-500"
            href="/ai"
          />
          <QuickCard
            title="Räknare"
            subtitle="Timmar & mått"
            icon={Calculator}
            gradient="from-cyan-600 to-teal-500"
            href="/miniraknare"
          />
        </div>

        <Link
          href="/anteckningar"
          className="mt-3 flex items-center gap-4 rounded-[1.25rem] border border-border bg-gradient-to-r from-amber-50 via-orange-50/80 to-card p-4 shadow-card transition active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <StickyNote className="h-6 w-6" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-text">Anteckningar</p>
            <p className="text-sm text-muted">Spara text & bilder</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted" />
        </Link>
      </section>

      <p className="pb-4 pt-2 text-center text-xs leading-relaxed text-muted">
        Data sparas lokalt · Exportera backup i Meny
      </p>
    </PageContainer>
  );
}

function JobGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function JobRow({ href, title, sub }: { href: string; title: string; sub?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl bg-background px-3 py-2.5 transition active:scale-[0.99]"
    >
      <div>
        <p className="font-semibold">{title}</p>
        {sub && <p className="text-sm text-muted">{sub}</p>}
      </div>
      <ChevronRight className="h-4 w-4 text-muted" />
    </Link>
  );
}

function QuickCard({
  title,
  subtitle,
  icon: Icon,
  gradient,
  href,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  gradient: string;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <p className="font-bold leading-tight">{title}</p>
      <p className="mt-0.5 text-xs text-white/80">{subtitle}</p>
    </>
  );

  const className = `flex min-h-[120px] flex-col justify-end rounded-[1.25rem] bg-gradient-to-br ${gradient} p-4 text-white shadow-card transition active:scale-[0.97]`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${className} text-left`}>
      {inner}
    </button>
  );
}
