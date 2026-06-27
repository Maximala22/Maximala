import type { StaffMember, Vehicle, VehicleType, WorkLog } from "./types";
import { generateId, isClient } from "./utils";

const VEHICLES_KEY = "jobbminne_vehicles";
const STAFF_KEY = "jobbminne_staff";
const WORKLOGS_KEY = "jobbminne_worklogs";
const SEEDED_KEY = "jobbminne_fleet_seeded";

export const defaultVehicles: Omit<Vehicle, "id" | "active" | "createdAt" | "updatedAt">[] = [
  { name: "42201 - Volvo EC 250 EL", type: "Grävmaskin" },
  { name: "42202 - Hitachi ZX 130", type: "Grävmaskin" },
  { name: "42203 - WJD18T - Volvo L 110 H", type: "Hjullastare", regNumber: "WJD18T" },
  { name: "42204 - Takeuchi 290-2", type: "Grävmaskin" },
  { name: "42205 - Takeuchi 290-2", type: "Grävmaskin" },
  { name: "42206 - DXT696 - Volvo L 60 H", type: "Hjullastare", regNumber: "DXT696" },
  { name: "42207 - Volvo L 90 H", type: "Hjullastare" },
  { name: "42208 - Volvo EC 140", type: "Grävmaskin" },
  { name: "42209 - DUB423 - Volvo L 60 G", type: "Hjullastare", regNumber: "DUB423" },
  { name: "42210 - Volvo EW 150 E", type: "Grävmaskin" },
  { name: "42211 - YKW173 - Volvo L 60 H", type: "Hjullastare", regNumber: "YKW173" },
  { name: "42212 - Volvo EC 140", type: "Grävmaskin" },
  { name: "42213 - Volvo EC 250 EL", type: "Grävmaskin" },
  { name: "42251 - DMX54L - Volvo FH 8X4", type: "Lastbil", regNumber: "DMX54L" },
  { name: "42252 - FYT324 - MB Arocs", type: "Lastbil", regNumber: "FYT324" },
  { name: "42291 - WNF810 - Volvo L 60 H", type: "Hjullastare", regNumber: "WNF810" },
  { name: "42292 - Volvo EC 160 EL", type: "Grävmaskin" },
  { name: "42293 - HWJ84L - Volvo FM 6X2", type: "Lastbil", regNumber: "HWJ84L" },
  { name: "422A1 - Manuella tjänster", type: "Annat" },
];

export const defaultStaff: Omit<StaffMember, "id" | "active" | "createdAt" | "updatedAt">[] = [
  { name: "Daniel Jakobsson", role: "Personal" },
  { name: "Fredrik Svensson", role: "Personal" },
  { name: "Axel Karlsson", role: "Personal" },
  { name: "Bo Flemström", role: "Personal" },
  { name: "Ellen Lundberg", role: "Personal" },
  { name: "Emma Lundberg", role: "Personal" },
  { name: "Erik Flemström", role: "Personal" },
  { name: "Johan Nilsson", role: "Personal" },
  { name: "Fredrik Brännmark", role: "Personal" },
  { name: "Jenny Hellström", role: "Personal" },
  { name: "Mehmet Arpaci", role: "Personal" },
  { name: "Ove Lööv", role: "Personal" },
  { name: "Rahim Tand", role: "Personal" },
  { name: "Simon Blomquist", role: "Personal" },
  { name: "Sven Palo", role: "Personal" },
];

function readJson<T>(key: string): T[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeJson<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function seedFleetData(): void {
  if (!isClient()) return;
  if (localStorage.getItem(SEEDED_KEY)) return;

  const vehicles = getVehicles();
  const staff = getStaff();

  if (vehicles.length === 0) {
    const now = new Date().toISOString();
    const seeded = defaultVehicles.map((v) => ({
      ...v,
      id: generateId(),
      active: true,
      createdAt: now,
      updatedAt: now,
    }));
    writeJson(VEHICLES_KEY, seeded);
  }

  if (staff.length === 0) {
    const now = new Date().toISOString();
    const seeded = defaultStaff.map((s) => ({
      ...s,
      id: generateId(),
      active: true,
      createdAt: now,
      updatedAt: now,
    }));
    writeJson(STAFF_KEY, seeded);
  }

  localStorage.setItem(SEEDED_KEY, "1");
}

export function getVehicles(): Vehicle[] {
  return readJson<Vehicle>(VEHICLES_KEY);
}

export function getActiveVehicles(): Vehicle[] {
  return getVehicles().filter((v) => v.active);
}

export function saveVehicle(vehicle: Vehicle): void {
  const all = getVehicles();
  const idx = all.findIndex((v) => v.id === vehicle.id);
  if (idx >= 0) all[idx] = vehicle;
  else all.push(vehicle);
  writeJson(VEHICLES_KEY, all);
}

export function createVehicle(data: {
  name: string;
  type: VehicleType;
  regNumber?: string;
  notes?: string;
}): Vehicle {
  const now = new Date().toISOString();
  const vehicle: Vehicle = {
    id: generateId(),
    name: data.name,
    type: data.type,
    regNumber: data.regNumber,
    notes: data.notes,
    active: true,
    createdAt: now,
    updatedAt: now,
  };
  saveVehicle(vehicle);
  return vehicle;
}

export function getStaff(): StaffMember[] {
  return readJson<StaffMember>(STAFF_KEY);
}

export function getActiveStaff(): StaffMember[] {
  return getStaff().filter((s) => s.active);
}

export function saveStaff(member: StaffMember): void {
  const all = getStaff();
  const idx = all.findIndex((s) => s.id === member.id);
  if (idx >= 0) all[idx] = member;
  else all.push(member);
  writeJson(STAFF_KEY, all);
}

export function createStaffMember(data: {
  name: string;
  role?: string;
  phone?: string;
}): StaffMember {
  const now = new Date().toISOString();
  const member: StaffMember = {
    id: generateId(),
    name: data.name,
    role: data.role,
    phone: data.phone,
    active: true,
    createdAt: now,
    updatedAt: now,
  };
  saveStaff(member);
  return member;
}

export function getWorkLogs(): WorkLog[] {
  return readJson<WorkLog>(WORKLOGS_KEY);
}

export function saveWorkLogs(logs: WorkLog[]): void {
  writeJson(WORKLOGS_KEY, logs);
}

export function saveWorkLog(log: WorkLog): void {
  const all = getWorkLogs();
  const idx = all.findIndex((l) => l.id === log.id);
  if (idx >= 0) all[idx] = log;
  else all.push(log);
  saveWorkLogs(all);
}

export function createWorkLog(data: Partial<WorkLog> & { date: string }): WorkLog {
  const now = new Date().toISOString();
  const log: WorkLog = {
    id: generateId(),
    date: data.date,
    vehicleId: data.vehicleId,
    staffId: data.staffId,
    driverName: data.driverName,
    vehicleName: data.vehicleName,
    place: data.place,
    hours: data.hours,
    description: data.description,
    imageIds: data.imageIds ?? [],
    createdAt: now,
    updatedAt: now,
  };
  saveWorkLog(log);
  return log;
}

export function updateWorkLog(id: string, updates: Partial<WorkLog>): WorkLog | null {
  const all = getWorkLogs();
  const idx = all.findIndex((l) => l.id === id);
  if (idx < 0) return null;
  const updated = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
  all[idx] = updated;
  saveWorkLogs(all);
  return updated;
}

export function deleteWorkLog(id: string): void {
  saveWorkLogs(getWorkLogs().filter((l) => l.id !== id));
}

export function getWorkLogsForDate(date: string): WorkLog[] {
  return getWorkLogs().filter((l) => l.date === date);
}

export function getTodaysWorkLogs(): WorkLog[] {
  const today = new Date().toISOString().split("T")[0];
  return getWorkLogsForDate(today);
}

export function getTotalHoursForDate(date: string): number {
  return getWorkLogsForDate(date).reduce((sum, l) => sum + (l.hours ?? 0), 0);
}

export function searchVehicles(query: string): Vehicle[] {
  const q = query.toLowerCase().trim();
  if (!q) return getActiveVehicles();
  return getActiveVehicles().filter(
    (v) =>
      v.name.toLowerCase().includes(q) ||
      v.type.toLowerCase().includes(q) ||
      (v.regNumber?.toLowerCase().includes(q) ?? false)
  );
}

export function searchStaff(query: string): StaffMember[] {
  const q = query.toLowerCase().trim();
  if (!q) return getActiveStaff();
  return getActiveStaff().filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      (s.role?.toLowerCase().includes(q) ?? false)
  );
}
