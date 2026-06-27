import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
}

export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
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

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
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
