export const colors = {
  background: "#FBF7F1",
  card: "#FFFFFF",
  text: "#241C15",
  muted: "#8A7A6B",
  border: "#E8D8C8",
  primary: "#C0612A",
  primaryDark: "#9E4F22",
  flemstromBlue: "#0097CF",
  flemstromBlueDark: "#00527C",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

export type JobStatus =
  | "Ej planerat"
  | "Planerad"
  | "Pågående"
  | "Klar"
  | "Uppföljning";

export type TimelineEvent = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
};

export type Job = {
  id: string;
  title: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  address?: string;
  date?: string;
  time?: string;
  status: JobStatus;
  description?: string;
  notes?: string;
  imageIds?: string[];
  archived?: boolean;
  archivedAt?: string;
  timeline?: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
};

export type VehicleType =
  | "Lastbil"
  | "Grävmaskin"
  | "Hjullastare"
  | "Skåpbil"
  | "Pickup"
  | "Annat";

export type Vehicle = {
  id: string;
  name: string;
  type: VehicleType;
  regNumber?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role?: string;
  phone?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WorkLog = {
  id: string;
  date: string;
  vehicleId?: string;
  staffId?: string;
  driverName?: string;
  vehicleName?: string;
  place?: string;
  hours?: number;
  description?: string;
  imageIds?: string[];
  createdAt: string;
  updatedAt: string;
};

export type Note = {
  id: string;
  title: string;
  text: string;
  imageIds?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
};

export type QuickContact = {
  id: string;
  name: string;
  role: string;
  company?: string;
  phone?: string;
  email?: string;
  address?: string;
  tags?: string[];
  favorite?: boolean;
};

export type BackupData = {
  jobs: Job[];
  vehicles: Vehicle[];
  staff: StaffMember[];
  workLogs: WorkLog[];
  notes: Note[];
  contacts?: QuickContact[];
  exportedAt: string;
  version: string;
};

export const JOB_STATUSES: JobStatus[] = [
  "Ej planerat",
  "Planerad",
  "Pågående",
  "Klar",
  "Uppföljning",
];

export const VEHICLE_TYPES: VehicleType[] = [
  "Lastbil",
  "Grävmaskin",
  "Hjullastare",
  "Skåpbil",
  "Pickup",
  "Annat",
];
