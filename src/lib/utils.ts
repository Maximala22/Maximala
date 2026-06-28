import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const STOCKHOLM_TZ = "Europe/Stockholm";

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Today's date as YYYY-MM-DD in Swedish timezone */
export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: STOCKHOLM_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Add days to an ISO date string, returns YYYY-MM-DD */
export function addDaysISO(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d + days);
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(isoToLocalDate(date)) : date;
  return d.toLocaleDateString("sv-SE", {
    timeZone: STOCKHOLM_TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatShortDate(dateStr: string): string {
  return new Date(isoToLocalDate(dateStr)).toLocaleDateString("sv-SE", {
    timeZone: STOCKHOLM_TZ,
    day: "numeric",
    month: "short",
  });
}

/** Parse YYYY-MM-DD as local calendar date (avoid UTC shift) */
export function isoToLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString("sv-SE", {
    timeZone: STOCKHOLM_TZ,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getGreeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("sv-SE", {
      timeZone: STOCKHOLM_TZ,
      hour: "numeric",
      hour12: false,
    }).format(new Date())
  );
  if (hour < 5) return "God natt";
  if (hour < 10) return "God morgon";
  if (hour < 18) return "God dag";
  if (hour < 22) return "God kväll";
  return "God natt";
}

export function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatHours(hours?: number): string {
  if (hours === undefined || hours === null) return "–";
  return hours.toLocaleString("sv-SE", { maximumFractionDigits: 1 });
}

export function isClient(): boolean {
  return typeof window !== "undefined";
}

export function normalizePhone(phone?: string): string | null {
  if (!phone?.trim()) return null;
  return phone.replace(/\s/g, "");
}

export function phoneHref(phone?: string): string | null {
  const p = normalizePhone(phone);
  return p ? `tel:${p}` : null;
}

export function smsHref(phone?: string): string | null {
  const p = normalizePhone(phone);
  return p ? `sms:${p}` : null;
}

export function whatsappHref(phone?: string): string | null {
  const p = normalizePhone(phone);
  if (!p) return null;
  const digits = p.replace(/[^0-9+]/g, "");
  return `https://wa.me/${digits.replace(/^\+/, "")}`;
}

export function mailHref(email?: string, subject?: string, body?: string): string | null {
  if (!email?.trim()) return null;
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString();
  return `mailto:${email}${qs ? `?${qs}` : ""}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function openMaps(address: string) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  window.open(mapsUrl, "_blank", "noopener,noreferrer");
}

export function openOutlook() {
  const outlookApp = "ms-outlook://";
  const fallback = "https://outlook.office.com/mail/";
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = outlookApp;
  document.body.appendChild(iframe);
  setTimeout(() => {
    document.body.removeChild(iframe);
    window.open(fallback, "_blank", "noopener,noreferrer");
  }, 500);
}

export function migrateJobStatus(status: string): import("./types").JobStatus {
  if (status === "Fakturera" || status === "Att fakturera") return "Uppföljning";
  if (status === "Ska genomföras") return "Planerad";
  const valid = ["Ej planerat", "Planerad", "Pågående", "Klar", "Uppföljning"];
  if (valid.includes(status)) return status as import("./types").JobStatus;
  return "Ej planerat";
}
