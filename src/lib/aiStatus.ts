import { getActiveJobs, getLastBackupAt } from "./storage";
import { getWorkLogs } from "./fleetStorage";
import { todayISO } from "./utils";

export type StatusItem = {
  id: string;
  message: string;
  href?: string;
};

export type StatusSummary = {
  count: number;
  items: StatusItem[];
  allGood: boolean;
  summaryText: string;
};

function buildOperationalItems(): StatusItem[] {
  const jobs = getActiveJobs();
  const workLogs = getWorkLogs();
  const today = todayISO();
  const items: StatusItem[] = [];
  const todaysLogs = workLogs.filter((l) => l.date === today);

  if (todaysLogs.length === 0 && jobs.length > 0) {
    items.push({
      id: "no-report-today",
      message: "Ingen rapport idag",
      href: "/fordon",
    });
  }

  const missingAddress = jobs.filter((j) => !j.address?.trim());
  if (missingAddress.length > 0) {
    items.push({
      id: "missing-address",
      message: `${missingAddress.length} jobb saknar adress`,
      href: "/status",
    });
  }

  const missingDate = jobs.filter((j) => !j.date?.trim());
  if (missingDate.length > 0) {
    items.push({
      id: "missing-date",
      message: `${missingDate.length} jobb saknar datum`,
      href: "/status",
    });
  }

  const followUp = jobs.filter((j) => j.status === "Uppföljning");
  if (followUp.length > 0) {
    items.push({
      id: "followup",
      message: `${followUp.length} jobb behöver uppföljning`,
      href: "/status",
    });
  }

  const missingHours = todaysLogs.filter((l) => l.hours === undefined || l.hours === null);
  if (missingHours.length > 0) {
    items.push({
      id: "missing-hours",
      message: `${missingHours.length} rapport${missingHours.length > 1 ? "er" : ""} saknar timmar`,
      href: "/fordon",
    });
  }

  return items;
}

function buildBackupItems(): StatusItem[] {
  const items: StatusItem[] = [];
  const lastBackup = getLastBackupAt();

  if (!lastBackup) {
    items.push({
      id: "no-backup",
      message: "Backup rekommenderas",
      href: "/meny",
    });
  } else {
    const days = Math.floor(
      (Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days > 14) {
      items.push({
        id: "old-backup",
        message: `Backup är ${days} dagar gammal`,
        href: "/meny",
      });
    }
  }

  return items;
}

function toSummary(items: StatusItem[]): StatusSummary {
  const count = items.length;
  const allGood = count === 0;
  return {
    count,
    items,
    allGood,
    summaryText: allGood
      ? "Allt ser bra ut"
      : `${count} sak${count > 1 ? "er" : ""} att kolla`,
  };
}

/** Operational only — for startsidan (no backup noise) */
export function getOperationalSummary(): StatusSummary {
  return toSummary(buildOperationalItems());
}

/** Full status including backup — for /status page */
export function getStatusSummary(): StatusSummary {
  return toSummary([...buildOperationalItems(), ...buildBackupItems()]);
}

/** Soft backup hint for startsidan footer */
export function getBackupHint(): string | null {
  const last = getLastBackupAt();
  if (!last) return "Backup rekommenderas — spara en kopia ibland.";
  const days = Math.floor(
    (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days > 14) return `Senaste backup var för ${days} dagar sedan.`;
  return null;
}

export function getDetailedStatusItems(): StatusItem[] {
  const jobs = getActiveJobs();
  const workLogs = getWorkLogs();
  const today = todayISO();
  const items: StatusItem[] = [];

  jobs
    .filter((j) => !j.address?.trim())
    .forEach((j) =>
      items.push({
        id: `addr-${j.id}`,
        message: `"${j.title}" saknar adress`,
        href: `/jobb/${j.id}/redigera`,
      })
    );

  jobs
    .filter((j) => !j.date?.trim())
    .forEach((j) =>
      items.push({
        id: `date-${j.id}`,
        message: `"${j.title}" saknar datum`,
        href: `/jobb/${j.id}/redigera`,
      })
    );

  jobs
    .filter((j) => j.status === "Uppföljning")
    .forEach((j) =>
      items.push({
        id: `follow-${j.id}`,
        message: `"${j.title}" behöver uppföljning`,
        href: `/jobb/${j.id}`,
      })
    );

  workLogs
    .filter((l) => l.date === today && (l.hours === undefined || l.hours === null))
    .forEach((l) =>
      items.push({
        id: `hours-${l.id}`,
        message: `Rapport saknar timmar (${l.driverName ?? "okänd"})`,
        href: "/fordon",
      })
    );

  return items;
}
