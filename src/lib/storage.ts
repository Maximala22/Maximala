import type { Job, JobStatus, TimelineEvent } from "./types";
import { generateId, isClient, migrateJobStatus, todayISO } from "./utils";

const JOBS_KEY = "jobbminne_jobs";
const USER_KEY = "jobbminne_user";
const PIN_KEY = "jobbminne_pin";
const LAST_BACKUP_KEY = "jobbminne_last_backup_at";

export function getUserName(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(USER_KEY);
}

export function setUserName(name: string): void {
  localStorage.setItem(USER_KEY, name);
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(PIN_KEY);
}

export function verifyPin(pin: string): boolean {
  const stored = localStorage.getItem(PIN_KEY);
  if (!stored) return true;
  return stored === pin;
}

export function setPin(pin: string): void {
  if (pin) localStorage.setItem(PIN_KEY, pin);
}

export function getJobs(): Job[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    if (!raw) return [];
    const jobs: Job[] = JSON.parse(raw);
    return jobs.map((j) => ({
      ...j,
      status: migrateJobStatus(j.status as string),
    }));
  } catch {
    return [];
  }
}

export function saveJobs(jobs: Job[]): void {
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function getJob(id: string): Job | null {
  return getJobs().find((j) => j.id === id) ?? null;
}

export function saveJob(job: Job): void {
  const jobs = getJobs();
  const idx = jobs.findIndex((j) => j.id === job.id);
  if (idx >= 0) jobs[idx] = job;
  else jobs.push(job);
  saveJobs(jobs);
}

export function createJob(partial: Partial<Job> & { title: string }): Job {
  const now = new Date().toISOString();
  const job: Job = {
    id: generateId(),
    title: partial.title,
    customerName: partial.customerName,
    customerPhone: partial.customerPhone,
    customerEmail: partial.customerEmail,
    address: partial.address,
    date: partial.date,
    time: partial.time,
    status: partial.status ?? "Ej planerat",
    description: partial.description,
    notes: partial.notes,
    imageIds: partial.imageIds ?? [],
    archived: false,
    timeline: [
      {
        id: generateId(),
        type: "created",
        message: "Jobb skapat",
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  saveJob(job);
  return job;
}

export function updateJob(id: string, updates: Partial<Job>): Job | null {
  const job = getJob(id);
  if (!job) return null;
  const now = new Date().toISOString();
  const updated: Job = { ...job, ...updates, updatedAt: now };
  if (updates.status && updates.status !== job.status) {
    updated.timeline = [
      ...(job.timeline ?? []),
      {
        id: generateId(),
        type: "status",
        message: `Status ändrad till ${updates.status}`,
        createdAt: now,
      },
    ];
  }
  saveJob(updated);
  return updated;
}

export function archiveJob(id: string): void {
  updateJob(id, { archived: true, archivedAt: new Date().toISOString() });
}

export function duplicateJob(id: string): Job | null {
  const job = getJob(id);
  if (!job) return null;
  return createJob({
    title: `${job.title} (kopia)`,
    customerName: job.customerName,
    customerPhone: job.customerPhone,
    customerEmail: job.customerEmail,
    address: job.address,
    date: job.date,
    time: job.time,
    status: "Ej planerat" as JobStatus,
    description: job.description,
    notes: job.notes,
    imageIds: [...(job.imageIds ?? [])],
  });
}

export function deleteJob(id: string): void {
  const jobs = getJobs().filter((j) => j.id !== id);
  saveJobs(jobs);
}

export function getActiveJobs(): Job[] {
  return getJobs().filter((j) => !j.archived);
}

export function getArchivedJobs(): Job[] {
  return getJobs().filter((j) => j.archived);
}

export function getJobsForDate(date: string): Job[] {
  return getActiveJobs().filter((j) => j.date === date);
}

export function getTodaysJobs(): Job[] {
  return getJobsForDate(todayISO());
}

export function getJobsByStatus(status: JobStatus): Job[] {
  return getActiveJobs().filter((j) => j.status === status);
}

export function addTimelineEvent(jobId: string, message: string, type = "note"): void {
  const job = getJob(jobId);
  if (!job) return;
  const event: TimelineEvent = {
    id: generateId(),
    type,
    message,
    createdAt: new Date().toISOString(),
  };
  updateJob(jobId, { timeline: [...(job.timeline ?? []), event] });
}

export function getLastBackupAt(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(LAST_BACKUP_KEY);
}

export function setLastBackupAt(iso: string): void {
  localStorage.setItem(LAST_BACKUP_KEY, iso);
}
