import type { QuickContact } from "./types";
import { generateId, isClient } from "./utils";
import { getActiveStaff } from "./fleetStorage";

const CONTACTS_KEY = "jobbminne_contacts";

const defaultContacts: Omit<QuickContact, "id">[] = [
  {
    name: "Elliot",
    role: "Support",
    company: "Jobbminne",
    phone: "",
    email: "flemstromelliot@gmail.com",
    tags: ["support"],
    favorite: true,
  },
];

export function getManualContacts(): QuickContact[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(CONTACTS_KEY);
    if (raw) return JSON.parse(raw);
    const seeded = defaultContacts.map((c) => ({ ...c, id: generateId() }));
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(seeded));
    return seeded;
  } catch {
    return [];
  }
}

export function saveManualContacts(contacts: QuickContact[]): void {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

export function createContact(data: Omit<QuickContact, "id">): QuickContact {
  const contact: QuickContact = { ...data, id: generateId() };
  const all = getManualContacts();
  all.push(contact);
  saveManualContacts(all);
  return contact;
}

export function updateContact(id: string, updates: Partial<QuickContact>): void {
  const all = getManualContacts();
  const idx = all.findIndex((c) => c.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...updates };
    saveManualContacts(all);
  }
}

export function getAllContacts(): QuickContact[] {
  const manual = getManualContacts();
  const staff = getActiveStaff();

  const staffContacts: QuickContact[] = staff.map((s) => ({
    id: `staff-${s.id}`,
    name: s.name,
    role: s.role ?? "Personal",
    company: "Flemströms",
    phone: s.phone,
    tags: ["personal"],
    favorite: false,
  }));

  const seen = new Set<string>();
  const merged: QuickContact[] = [];

  for (const c of [...manual, ...staffContacts]) {
    const key = c.name.toLowerCase().trim();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(c);
  }

  return merged.sort((a, b) => {
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    return a.name.localeCompare(b.name, "sv");
  });
}

export function searchContacts(query: string): QuickContact[] {
  const q = query.toLowerCase().trim();
  const contacts = getAllContacts();
  if (!q) return contacts;
  return contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      (c.company?.toLowerCase().includes(q) ?? false) ||
      (c.phone?.includes(q) ?? false) ||
      (c.email?.toLowerCase().includes(q) ?? false) ||
      (c.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
  );
}

export function toggleFavorite(id: string): void {
  const all = getManualContacts();
  const idx = all.findIndex((c) => c.id === id);
  if (idx >= 0) {
    all[idx].favorite = !all[idx].favorite;
    saveManualContacts(all);
  }
}
