import type { Job } from "./types";

function formatIcsDate(date: string, time?: string, allDay = false): string {
  const d = date.replace(/-/g, "");
  if (allDay || !time) return d;
  const [h, m] = time.split(":");
  return `${d}T${h.padStart(2, "0")}${m.padStart(2, "0")}00`;
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function createJobIcs(job: Job): string {
  const allDay = !job.time;
  const dtStart = formatIcsDate(job.date ?? new Date().toISOString().split("T")[0], job.time, allDay);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Flemströms//Jobbminne//SV",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:jobbminne-${job.id}@flemstroms.se`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString().split("T")[0], "12:00")}Z`,
  ];

  if (allDay) {
    lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
    const endDate = new Date(job.date ?? new Date());
    endDate.setDate(endDate.getDate() + 1);
    lines.push(`DTEND;VALUE=DATE:${endDate.toISOString().split("T")[0].replace(/-/g, "")}`);
  } else {
    lines.push(`DTSTART:${dtStart}`);
    const [h, m] = (job.time ?? "09:00").split(":").map(Number);
    const endH = String(h + 1).padStart(2, "0");
    const endM = String(m).padStart(2, "0");
    lines.push(`DTEND:${dtStart.slice(0, 8)}T${endH}${endM}00`);
  }

  lines.push(`SUMMARY:${escapeIcs(job.title)}`);
  if (job.customerName) lines.push(`DESCRIPTION:${escapeIcs(`Kund: ${job.customerName}`)}`);
  if (job.address) lines.push(`LOCATION:${escapeIcs(job.address)}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}

export function createJobsIcs(jobs: Job[]): string {
  const events = jobs
    .filter((j) => j.date)
    .map((job) => {
      const allDay = !job.time;
      const dtStart = formatIcsDate(job.date!, job.time, allDay);
      const eventLines = [
        "BEGIN:VEVENT",
        `UID:jobbminne-${job.id}@flemstroms.se`,
        `DTSTAMP:${formatIcsDate(new Date().toISOString().split("T")[0], "12:00")}Z`,
      ];
      if (allDay) {
        eventLines.push(`DTSTART;VALUE=DATE:${dtStart}`);
      } else {
        eventLines.push(`DTSTART:${dtStart}`);
      }
      eventLines.push(`SUMMARY:${escapeIcs(job.title)}`);
      if (job.address) eventLines.push(`LOCATION:${escapeIcs(job.address)}`);
      eventLines.push("END:VEVENT");
      return eventLines.join("\r\n");
    });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Flemströms//Jobbminne//SV",
    "CALSCALE:GREGORIAN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcsFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function copyCalendarInfo(job: Job): string {
  const parts = [job.title];
  if (job.date) parts.push(`Datum: ${job.date}`);
  if (job.time) parts.push(`Tid: ${job.time}`);
  if (job.customerName) parts.push(`Kund: ${job.customerName}`);
  if (job.address) parts.push(`Plats: ${job.address}`);
  if (job.customerPhone) parts.push(`Tel: ${job.customerPhone}`);
  return parts.join("\n");
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}
