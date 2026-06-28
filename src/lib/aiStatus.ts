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

export function getStatusSummary(): StatusSummary {
  const jobs = getActiveJobs();
  const workLogs = getWorkLogs();
  const today = todayISO();
  const items: StatusItem[] = [];

  const lastBackup = getLastBackupAt();
  if (!lastBackup) {
    items.push({
      id: "no-backup",
      message: "Backup saknas — exportera en kopia",
      href: "/meny",
    });
  } else {
    const days = Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24));
    if (days > 14) {
      items.push({
        id: "old-backup",
        message: `Backup är ${days} dagar gammal`,
        href: "/meny",
      });
    }
  }

  const todaysLogs = workLogs.filter((l) => l.date === today);
  if (todaysLogs.length === 0 && jobs.length > 0) {
    items.push({
      id: "no-report-today",
      message: "Ingen rapport idag",
      href: "/fordon",
    });
  }

  const missingImage = jobs.filter((j) => !j.imageIds?.length);
  if (missingImage.length > 0 && missingImage.length <= 3) {
    missingImage.forEach((j) =>
      items.push({
        id: `img-${j.id}`,
        message: `"${j.title}" saknar bild`,
        href: `/jobb/${j.id}`,
      })
    );
  } else if (missingImage.length > 3) {
    items.push({
      id: "missing-images",
      message: `${missingImage.length} jobb saknar bild`,
      href: "/jobb",
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

  const missingPhone = jobs.filter((j) => !j.customerPhone?.trim());
  if (missingPhone.length > 0) {
    items.push({
      id: "missing-phone",
      message: `${missingPhone.length} jobb saknar telefonnummer`,
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

  const ongoing = jobs.filter((j) => j.status === "Pågående");
  if (ongoing.length > 0) {
    items.push({
      id: "ongoing",
      message: `${ongoing.length} jobb pågår`,
      href: "/jobb",
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
      message: `${missingHours.length} dagsrapport${missingHours.length > 1 ? "er" : ""} saknar timmar`,
      href: "/fordon",
    });
  }

  const missingPlace = todaysLogs.filter((l) => !l.place?.trim());
  if (missingPlace.length > 0) {
    items.push({
      id: "missing-place",
      message: `${missingPlace.length} dagsrapport${missingPlace.length > 1 ? "er" : ""} saknar plats`,
      href: "/fordon",
    });
  }

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
    .filter((j) => !j.customerPhone?.trim())
    .forEach((j) =>
      items.push({
        id: `phone-${j.id}`,
        message: `"${j.title}" saknar telefonnummer`,
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
        message: `Dagsrapport saknar timmar (${l.driverName ?? "okänd"})`,
        href: "/fordon",
      })
    );

  workLogs
    .filter((l) => l.date === today && !l.place?.trim())
    .forEach((l) =>
      items.push({
        id: `place-${l.id}`,
        message: `Dagsrapport saknar plats (${l.driverName ?? "okänd"})`,
        href: "/fordon",
      })
    );

  return items;
}
