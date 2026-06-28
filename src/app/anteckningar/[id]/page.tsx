"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import ImageUpload from "@/components/ImageUpload";
import { getNote, updateNote, archiveNote } from "@/lib/notesStorage";
import { printNote } from "@/lib/print";

export default function AnteckningDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const note = getNote(id);
  const [title, setTitle] = useState(note?.title ?? "");
  const [text, setText] = useState(note?.text ?? "");
  const [tags, setTags] = useState(note?.tags?.join(", ") ?? "");
  const [imageIds, setImageIds] = useState<string[]>(note?.imageIds ?? []);

  if (!note) {
    return <div className="p-4">Anteckningen hittades inte.</div>;
  }

  const handleSave = () => {
    updateNote(id, {
      title: title.trim() || "Namnlös",
      text,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      imageIds,
    });
  };

  return (
    <PageContainer>
      <Header title="Anteckning" backHref="/anteckningar" />
      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-sm text-muted">Titel</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-lg font-semibold" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Text</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="w-full rounded-2xl border border-border bg-card px-4 py-3" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Taggar (kommaseparerade)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full rounded-2xl border border-border bg-card px-4 py-3" />
        </div>
        <ImageUpload imageIds={imageIds} onChange={setImageIds} />
        <Button fullWidth onClick={handleSave}>Spara</Button>
        <Button fullWidth variant="secondary" onClick={() => printNote({ ...note, title, text })}>Skriv ut</Button>
        <Button fullWidth variant="ghost" onClick={() => {
          if (confirm("Arkivera anteckningen?")) {
            archiveNote(id);
            router.push("/anteckningar");
          }
        }}>Arkivera</Button>
      </div>
    </PageContainer>
  );
}
