"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import StatusPill from "@/components/StatusPill";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { getActiveJobs, getJobsForDate } from "@/lib/storage";
import { createJobsIcs, downloadIcsFile, getDaysInMonth, getFirstDayOfMonth } from "@/lib/calendar";
import { capitalizeFirst } from "@/lib/utils";

const WEEKDAYS = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

export default function KalenderPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(now.toISOString().split("T")[0]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const allJobs = getActiveJobs();

  const jobsOnDate = (dateStr: string) => allJobs.filter((j) => j.date === dateStr);
  const selectedJobs = getJobsForDate(selectedDate);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const monthName = capitalizeFirst(
    new Date(year, month, 1).toLocaleDateString("sv-SE", { month: "long", year: "numeric" })
  );

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const todayStr = now.toISOString().split("T")[0];

  return (
    <PageContainer>
      <Header title="Kalender" subtitle="Jobb per dag" />

      <Card className="mt-5">
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-primary transition active:bg-background"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="font-semibold capitalize">{monthName}</p>
          <button
            onClick={nextMonth}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-primary transition active:bg-background"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const ds = dateStr(day);
            const count = jobsOnDate(ds).length;
            const isSelected = ds === selectedDate;
            const isToday = ds === todayStr;
            return (
              <button
                key={ds}
                onClick={() => setSelectedDate(ds)}
                className={`relative flex aspect-square items-center justify-center rounded-xl text-sm font-medium transition active:scale-95 ${
                  isSelected
                    ? "bg-primary text-white shadow-warm"
                    : isToday
                      ? "bg-primary/12 font-bold text-primary"
                      : "hover:bg-background"
                }`}
              >
                {day}
                {count > 0 && (
                  <span
                    className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${
                      isSelected ? "bg-white" : "bg-primary"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <section className="mt-8">
        <SectionTitle>
          {capitalizeFirst(
            new Date(selectedDate).toLocaleDateString("sv-SE", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })
          )}
        </SectionTitle>
        {selectedJobs.length === 0 ? (
          <Card className="flex flex-col items-center py-8 text-center">
            <CalendarDays className="mb-3 h-8 w-8 text-muted" />
            <p className="text-muted">Inga jobb denna dag.</p>
          </Card>
        ) : (
          selectedJobs.map((job) => (
            <Link key={job.id} href={`/jobb/${job.id}`}>
              <Card interactive className="mb-2 flex items-center justify-between py-4">
                <div>
                  <p className="font-semibold">{job.title}</p>
                  {job.time && <p className="text-sm text-muted">kl. {job.time}</p>}
                </div>
                <StatusPill status={job.status} />
              </Card>
            </Link>
          ))
        )}
      </section>

      {selectedJobs.length > 0 && (
        <Button
          fullWidth
          className="mt-5"
          variant="secondary"
          onClick={() =>
            downloadIcsFile(`jobb-${selectedDate}.ics`, createJobsIcs(selectedJobs))
          }
        >
          Exportera dagens jobb
        </Button>
      )}
    </PageContainer>
  );
}
