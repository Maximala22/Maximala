import type { Note } from "./types";
import { generateId, isClient } from "./utils";

const NOTES_KEY = "jobbminne_notes";

export function getNotes(): Note[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export function getNote(id: string): Note | null {
  return getNotes().find((n) => n.id === id) ?? null;
}

export function saveNote(note: Note): void {
  const notes = getNotes();
  const idx = notes.findIndex((n) => n.id === note.id);
  if (idx >= 0) notes[idx] = note;
  else notes.push(note);
  saveNotes(notes);
}

export function createNote(data: { title: string; text?: string; tags?: string[] }): Note {
  const now = new Date().toISOString();
  const note: Note = {
    id: generateId(),
    title: data.title,
    text: data.text ?? "",
    tags: data.tags ?? [],
    imageIds: [],
    archived: false,
    createdAt: now,
    updatedAt: now,
  };
  const notes = getNotes();
  notes.push(note);
  saveNotes(notes);
  return note;
}

export function updateNote(id: string, updates: Partial<Note>): Note | null {
  const notes = getNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx < 0) return null;
  const updated = { ...notes[idx], ...updates, updatedAt: new Date().toISOString() };
  notes[idx] = updated;
  saveNotes(notes);
  return updated;
}

export function archiveNote(id: string): void {
  updateNote(id, { archived: true });
}

export function deleteNote(id: string): void {
  saveNotes(getNotes().filter((n) => n.id !== id));
}

export function getActiveNotes(): Note[] {
  return getNotes().filter((n) => !n.archived);
}

export function searchNotes(query: string): Note[] {
  const q = query.toLowerCase().trim();
  const notes = getActiveNotes();
  if (!q) return notes;
  return notes.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.text.toLowerCase().includes(q) ||
      (n.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
  );
}
