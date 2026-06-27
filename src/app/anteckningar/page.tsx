"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { getActiveNotes, searchNotes, createNote } from "@/lib/notesStorage";

export default function AnteckningarPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const notes = query ? searchNotes(query) : getActiveNotes();

  const handleCreate = () => {
    const note = createNote({ title: "Ny anteckning" });
    router.push(`/anteckningar/${note.id}`);
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-6">
      <Header
        title="Anteckningar"
        subtitle="Spara egna anteckningar, bilder och saker att komma ihåg."
      />
      <input
        type="search"
        placeholder="Sök anteckning…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mt-4 w-full rounded-2xl border border-border bg-card px-4 py-3"
      />
      <Button fullWidth className="mt-4" onClick={handleCreate}>+ Ny anteckning</Button>
      <div className="mt-4 space-y-3">
        {notes.length === 0 ? (
          <Card>
            <p className="text-center text-muted">Inga anteckningar ännu. Skapa din första anteckning.</p>
          </Card>
        ) : (
          notes.map((note) => (
            <Link key={note.id} href={`/anteckningar/${note.id}`}>
              <Card className="mb-2">
                <p className="font-semibold">{note.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{note.text || "Tom anteckning"}</p>
                <p className="mt-1 text-xs text-muted">
                  {new Date(note.updatedAt).toLocaleDateString("sv-SE")}
                </p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
