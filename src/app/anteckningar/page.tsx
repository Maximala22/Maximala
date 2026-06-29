"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StickyNote, Plus } from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import { getActiveNotes, searchNotes, createNote } from "@/lib/notesStorage";

export default function AnteckningarPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const allNotes = getActiveNotes();
  const isEmpty = allNotes.length === 0;
  const notes = query ? searchNotes(query) : allNotes;

  const handleCreate = () => {
    const note = createNote({ title: "Ny anteckning" });
    router.push(`/anteckningar/${note.id}`);
  };

  return (
    <PageContainer>
      <Header
        title="Anteckningar"
        subtitle="Spara text, bilder och saker att komma ihåg."
      />

      {isEmpty ? (
        <Card className="mt-4 py-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-note-light text-note-dark">
            <StickyNote className="h-7 w-7" />
          </div>
          <p className="text-lg font-bold">Inga anteckningar ännu</p>
          <p className="mt-2 text-sm text-muted">
            Spara text, bilder eller saker att komma ihåg.
          </p>
          <Button className="mt-6" onClick={handleCreate}>
            <Plus className="h-4 w-4" /> Ny anteckning
          </Button>
        </Card>
      ) : (
        <>
          <input
            type="search"
            placeholder="Sök anteckning…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field mt-4"
          />

          <Button fullWidth className="mt-3" onClick={handleCreate}>
            <Plus className="h-4 w-4" /> Ny anteckning
          </Button>

          <div className="mt-4 space-y-2.5">
            {notes.map((note) => (
              <Link key={note.id} href={`/anteckningar/${note.id}`}>
                <Card interactive className="mb-0">
                  <p className="font-semibold">{note.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">
                    {note.text || "Tom anteckning"}
                  </p>
                  <p className="mt-1.5 text-xs text-muted">
                    {new Date(note.updatedAt).toLocaleDateString("sv-SE")}
                    {note.imageIds?.length
                      ? ` · ${note.imageIds.length} bild${note.imageIds.length > 1 ? "er" : ""}`
                      : ""}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}
