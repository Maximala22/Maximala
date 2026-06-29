import type { Job, WorkLog } from "./types";
import { saveJobs, getJobs } from "./storage";
import { getWorkLogs, saveWorkLogs } from "./fleetStorage";
import { todayISO, isClient } from "./utils";

const DEMO_FLAG = "jobbminne_demo_active";
const SNAPSHOT_KEY = "jobbminne_snapshot_before_demo";

const DEMO_JOB_IDS = ["demo-job-1", "demo-job-2", "demo-job-3", "demo-job-4"];
const DEMO_LOG_ID = "demo-log-1";

function buildDemoJobs(): Job[] {
  const now = new Date().toISOString();
  const today = todayISO();
  return [
    {
      id: "demo-job-1",
      title: "Schaktning Handelsvägen",
      customerName: "Handelsvägen AB",
      address: "Handelsvägen 9, Luleå",
      date: today,
      status: "Pågående",
      description: "Schaktning och förberedelse för ny ledning.",
      imageIds: [],
      archived: false,
      timeline: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "demo-job-2",
      title: "Dränering villa",
      customerName: "Andersson",
      address: "Storgatan 12, Piteå",
      date: today,
      status: "Planerad",
      imageIds: [],
      archived: false,
      timeline: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "demo-job-3",
      title: "Service maskin",
      customerName: "Intern",
      status: "Ej planerat",
      imageIds: [],
      archived: false,
      timeline: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "demo-job-4",
      title: "Transport grus",
      customerName: "Bygg & Anläggning Nord",
      address: "Industrivägen 3",
      status: "Klar",
      imageIds: [],
      archived: false,
      timeline: [],
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function buildDemoWorkLog(): WorkLog {
  const now = new Date().toISOString();
  return {
    id: DEMO_LOG_ID,
    date: todayISO(),
    driverName: "Bo Flemström",
    vehicleName: "42201 - Volvo EC 250 EL",
    hours: 6.5,
    description:
      "Schaktat och förberett för ny ledning. Bilder tagna före återfyllnad.",
    imageIds: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function isDemoActive(): boolean {
  if (!isClient()) return false;
  return localStorage.getItem(DEMO_FLAG) === "true";
}

function snapshotCurrentData(): void {
  if (!isClient()) return;
  const snapshot = {
    jobs: localStorage.getItem("jobbminne_jobs"),
    worklogs: localStorage.getItem("jobbminne_worklogs"),
  };
  localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
}

function restoreSnapshot(): void {
  if (!isClient()) return;
  const raw = localStorage.getItem(SNAPSHOT_KEY);
  if (raw) {
    try {
      const snapshot = JSON.parse(raw) as { jobs?: string | null; worklogs?: string | null };
      if (snapshot.jobs) localStorage.setItem("jobbminne_jobs", snapshot.jobs);
      else localStorage.removeItem("jobbminne_jobs");
      if (snapshot.worklogs) localStorage.setItem("jobbminne_worklogs", snapshot.worklogs);
      else localStorage.removeItem("jobbminne_worklogs");
    } catch {
      /* ignore */
    }
  }
  localStorage.removeItem(SNAPSHOT_KEY);
}

/** Ladda exempeljobb och dagsrapport för demo/screenshots */
export function loadDemo(): { success: boolean; message: string } {
  if (!isClient()) return { success: false, message: "Ej tillgängligt" };
  if (!isDemoActive()) {
    snapshotCurrentData();
  }

  const existingJobs = getJobs().filter((j) => !DEMO_JOB_IDS.includes(j.id));
  const demoJobs = buildDemoJobs();
  saveJobs([...existingJobs, ...demoJobs]);

  const existingLogs = getWorkLogs().filter((l) => l.id !== DEMO_LOG_ID);
  saveWorkLogs([...existingLogs, buildDemoWorkLog()]);

  localStorage.setItem(DEMO_FLAG, "true");
  return { success: true, message: "Demodata laddad" };
}

/** Återställ data från före demo */
export function clearDemo(): { success: boolean; message: string } {
  if (!isClient()) return { success: false, message: "Ej tillgängligt" };
  if (!isDemoActive()) {
    return { success: false, message: "Ingen demo aktiv" };
  }

  restoreSnapshot();
  localStorage.removeItem(DEMO_FLAG);
  return { success: true, message: "Demo borttagen" };
}
