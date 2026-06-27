"use client";

import { useState, useCallback } from "react";
import { Camera, X, Loader2 } from "lucide-react";
import { saveImage, getImage, deleteImage } from "@/lib/imageStorage";
import Button from "./Button";

type ImageUploadProps = {
  imageIds: string[];
  onChange: (ids: string[]) => void;
};

export default function ImageUpload({ imageIds, onChange }: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const loadPreview = useCallback(async (id: string) => {
    const img = await getImage(id);
    if (img) setPreviews((p) => ({ ...p, [id]: img.dataUrl }));
  }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Välj en bildfil.");
      return;
    }
    setLoading(true);
    try {
      const id = await saveImage(file);
      const img = await getImage(id);
      if (img) setPreviews((p) => ({ ...p, [id]: img.dataUrl }));
      onChange([...imageIds, id]);
      setError(null);
    } catch {
      setError("Kunde inte spara bilden.");
    }
    setLoading(false);
    e.target.value = "";
  };

  const handleRemove = async (id: string) => {
    await deleteImage(id);
    onChange(imageIds.filter((i) => i !== id));
    setPreviews((p) => {
      const next = { ...p };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-background px-4 py-5 text-sm font-medium text-muted transition hover:border-primary/50 hover:bg-card active:scale-[0.99]">
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Lägger till bild…
          </>
        ) : (
          <>
            <Camera className="h-5 w-5" />
            Lägg till bild
          </>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFile}
          disabled={loading}
        />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {imageIds.map((id) => {
          if (!previews[id]) loadPreview(id);
          return (
            <div key={id} className="relative">
              {previews[id] && (
                <>
                  <img
                    src={previews[id]}
                    alt=""
                    className="h-20 w-20 rounded-2xl object-cover shadow-card"
                    onClick={() => setLightbox(previews[id])}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(id)}
                    className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white shadow-card"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded-2xl" />
          <Button
            variant="secondary"
            size="sm"
            className="absolute right-4 top-4"
            onClick={() => setLightbox(null)}
          >
            Stäng
          </Button>
        </div>
      )}
    </div>
  );
}
