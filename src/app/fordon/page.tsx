"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MapPin, Printer, Pencil, Trash2, Plus } from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import Toast from "@/components/Toast";
import {
  getWorkLogsForDate,
  getTotalHoursForDate,
  deleteWorkLog,
  getActiveVehicles,
  getActiveStaff,
} from "@/lib/fleetStorage";
import { formatHours, openMaps, todayISO, addDaysISO, isoToLocalDate } from "@/lib/utils";
import { printWorkLog } from "@/lib/print";

function DagsrapportContent() {
  const searchParams = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [showResources, setShowResources] = useState(false);
  const [toast, setToast] = useState("");
  const [, refresh] = useState(0);

  useEffect(() => {
    const d = searchParams.get("date");
    if (d) setSelectedDate(d);
    if (searchParams.get("saved") === "1") {
      setToast("Rapport sparad");
      setTimeout(() => setToast(""), 2500);
    }
  }, [searchParams]);

  const logs = getWorkLogsForDate(selectedDate);
  const totalHours = getTotalHoursForDate(selectedDate);
  const isToday = selectedDate === todayISO();

  const shiftDate = (days: number) => {
    setSelectedDate(addDaysISO(selectedDate, days));
  };

  const dateLabel = new Date(isoToLocalDate(selectedDate)).toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <PageContainer>
      <Header
        title="Dagsrapport"
        subtitle="Vem körde vad och vad gjordes?"
      />

      <Card className="mt-4 flex items-center justify-between py-2.5">
        <button
          type="button"
          onClick={() => shiftDate(-1)}
          className="rounded-xl px-2 py-2 text-primary active:opacity-70"
          aria-label="Föregående dag"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            {isToday ? "Idag" : "Vald dag"}
          </p>
          <button
            type="button"
            onClick={() => setSelectedDate(todayISO())}
            className="mt-0.5 text-sm font-semibold text-text capitalize"
          >
            {dateLabel}
          </button>
          {!isToday && (
            <button
              type="button"
              onClick={() => setSelectedDate(todayISO())}
              className="mt-1 text-xs font-medium text-primary"
            >
              Gå till idag
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => shiftDate(1)}
          className="rounded-xl px-2 py-2 text-primary active:opacity-70"
          aria-label="Nästa dag"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </Card>

      <Card className="mt-3 flex items-center justify-between py-3">
        <p className="text-sm text-muted">Total tid</p>
        <p className="text-lg font-bold text-flemstromBlue">{formatHours(totalHours)} h</p>
      </Card>

      <Link href={`/fordon/ny?date=${selectedDate}`} className="mt-4 block">
        <Button fullWidth size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Lägg dagsrapport
        </Button>
      </Link>

      <section className="mt-5">
        <SectionTitle>
          {isToday ? "Dagens rapporter" : "Rapporter"}
        </SectionTitle>

        {logs.length === 0 ? (
          <Card className="py-6 text-center">
            <p className="font-semibold">
              {isToday ? "Inga rapporter idag" : "Inga rapporter denna dag"}
            </p>
            <p className="mt-1 text-sm text-muted">
              Lägg dagens första rapport med timmar, fordon och vad som gjorts.
            </p>
            <Link href={`/fordon/ny?date=${selectedDate}`} className="mt-4 inline-block">
              <Button>Lägg dagsrapport</Button>
            </Link>
          </Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id} className="mb-2.5">
              <p className="font-semibold">
                {log.driverName ?? "–"} · {log.vehicleName ?? "–"}
              </p>
              {log.hours !== undefined && (
                <p className="mt-1 text-sm font-medium text-flemstromBlue">
                  {formatHours(log.hours)} h
                </p>
              )}
              {log.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted">{log.description}</p>
              )}
              <div className="mt-2.5 flex flex-wrap gap-2">
                <Link
                  href={`/fordon/ny?date=${selectedDate}&edit=${log.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-text active:scale-[0.98]"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Redigera
                </Link>
                {log.place && (
                  <ActionChip icon={MapPin} label="Karta" onClick={() => openMaps(log.place!)} />
                )}
                <ActionChip icon={Printer} label="Skriv ut" onClick={() => printWorkLog(log)} />
                <ActionChip
                  icon={Trash2}
                  label="Ta bort"
                  danger
                  onClick={() => {
                    if (confirm("Ta bort rapporten?")) {
                      deleteWorkLog(log.id);
                      refresh((n) => n + 1);
                      setToast("Rapport borttagen");
                      setTimeout(() => setToast(""), 2000);
                    }
                  }}
                />
              </div>
            </Card>
          ))
        )}
      </section>

      <section className="mt-6">
        <button
          type="button"
          onClick={() => setShowResources(!showResources)}
          className="w-full text-left text-sm font-semibold text-primary"
        >
          {showResources ? "▲ Dölj fordon och personal" : "▼ Visa fordon och personal"}
        </button>
        {showResources && (
          <div className="mt-3 space-y-3">
            <Card className="divide-y divide-border py-0">
              <p className="py-2 text-xs font-bold uppercase tracking-wide text-muted">
                Fordon ({getActiveVehicles().length})
              </p>
              {getActiveVehicles().slice(0, 8).map((v) => (
                <div key={v.id} className="py-2 text-sm">
                  {v.name}
                  {v.regNumber && <span className="text-muted"> · {v.regNumber}</span>}
                </div>
              ))}
            </Card>
            <Card className="divide-y divide-border py-0">
              <p className="py-2 text-xs font-bold uppercase tracking-wide text-muted">
                Personal ({getActiveStaff().length})
              </p>
              {getActiveStaff().slice(0, 8).map((s) => (
                <div key={s.id} className="py-2 text-sm">
                  {s.name}
                  {s.role && <span className="text-muted"> · {s.role}</span>}
                </div>
              ))}
            </Card>
          </div>
        )}
      </section>

      <Toast message={toast} visible={!!toast} />
    </PageContainer>
  );
}

export default function FordonPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <Header title="Dagsrapport" />
          <p className="mt-8 text-center text-muted">Laddar…</p>
        </PageContainer>
      }
    >
      <DagsrapportContent />
    </Suspense>
  );
}

function ActionChip({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  const cls = `inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium active:scale-[0.98] ${
    danger ? "text-danger" : "text-text"
  }`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        <Icon className="h-3.5 w-3.5" />
        {label}
      </button>
    );
  }

  return (
    <span className={cls}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
