import { getJobs, getLastBackupAt, setLastBackupAt } from "./storage";
import { getVehicles, getStaff, getWorkLogs } from "./fleetStorage";
import { getNotes } from "./notesStorage";
import { getManualContacts } from "./contacts";
import type { BackupData } from "./types";

export function exportBackup(): BackupData {
  const data: BackupData = {
    jobs: getJobs(),
    vehicles: getVehicles(),
    staff: getStaff(),
    workLogs: getWorkLogs(),
    notes: getNotes(),
    contacts: getManualContacts(),
    exportedAt: new Date().toISOString(),
    version: "0.3",
  };
  setLastBackupAt(data.exportedAt);
  return data;
}

export function downloadBackup(): void {
  const data = exportBackup();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jobbminne-backup-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackup(json: unknown): { success: boolean; error?: string } {
  try {
    const data = json as Partial<BackupData>;
    if (!data || typeof data !== "object") {
      return { success: false, error: "Ogiltig fil" };
    }

    if (Array.isArray(data.jobs)) {
      localStorage.setItem("jobbminne_jobs", JSON.stringify(data.jobs));
    }
    if (Array.isArray(data.vehicles)) {
      localStorage.setItem("jobbminne_vehicles", JSON.stringify(data.vehicles));
    }
    if (Array.isArray(data.staff)) {
      localStorage.setItem("jobbminne_staff", JSON.stringify(data.staff));
    }
    if (Array.isArray(data.workLogs)) {
      localStorage.setItem("jobbminne_worklogs", JSON.stringify(data.workLogs));
    }
    if (Array.isArray(data.notes)) {
      localStorage.setItem("jobbminne_notes", JSON.stringify(data.notes));
    }
    if (Array.isArray(data.contacts)) {
      localStorage.setItem("jobbminne_contacts", JSON.stringify(data.contacts));
    }

    return { success: true };
  } catch {
    return { success: false, error: "Kunde inte läsa filen" };
  }
}

export function getBackupWarning(): string | null {
  const last = getLastBackupAt();
  if (!last) return "Ingen backup har exporterats ännu.";
  const days = Math.floor((Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24));
  if (days > 14) return `Senaste backup var för ${days} dagar sedan.`;
  return null;
}
