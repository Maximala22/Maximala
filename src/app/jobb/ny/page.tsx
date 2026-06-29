"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ImageUpload from "@/components/ImageUpload";
import PageContainer from "@/components/PageContainer";
import Toast from "@/components/Toast";
import { createJob } from "@/lib/storage";
import { JOB_STATUSES, type JobStatus } from "@/lib/types";

export default function NyttJobbPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <Header title="Nytt jobb" subtitle="Skapa ett jobb på några sekunder" backHref="/jobb" />
          <p className="mt-8 text-center text-muted">Laddar…</p>
        </PageContainer>
      }
    >
      <NyttJobbForm />
    </Suspense>
  );
}

function NyttJobbForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<JobStatus>("Ej planerat");
  const [showMore, setShowMore] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [imageIds, setImageIds] = useState<string[]>([]);
  const [toast, setToast] = useState("");

  const canSave = title.trim().length > 0;

  useEffect(() => {
    const presetDate = searchParams.get("date");
    if (presetDate) {
      setDate(presetDate);
      setShowMore(true);
    }
  }, [searchParams]);

  const handleSave = () => {
    if (!canSave) return;
    const job = createJob({
      title: title.trim(),
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      address: address || undefined,
      status,
      date: date || undefined,
      time: time || undefined,
      customerEmail: customerEmail || undefined,
      description: description || undefined,
      notes: notes || undefined,
      imageIds,
    });
    setToast("Jobb sparat");
    setTimeout(() => router.push(`/jobb/${job.id}`), 400);
  };

  return (
    <PageContainer compact>
      <Header
        title="Nytt jobb"
        subtitle="Fyll i det viktigaste först"
        backHref="/jobb"
      />

      <div className="mt-4 space-y-4">
        <Field label="Titel *" value={title} onChange={setTitle} placeholder="t.ex. Schaktning" />
        <Field label="Kundnamn" value={customerName} onChange={setCustomerName} />
        <Field label="Telefon" value={customerPhone} onChange={setCustomerPhone} type="tel" />
        <Field
          label="Adress / plats"
          value={address}
          onChange={setAddress}
          placeholder="t.ex. Handelsvägen 9, Luleå"
        />
        <div>
          <label className="label-upper mb-1.5 block">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as JobStatus)}
            className="input-field"
          >
            {JOB_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <Button fullWidth size="lg" onClick={handleSave} disabled={!canSave}>
            {canSave ? "Spara jobb" : "Fyll i titel för att spara"}
          </Button>
          {!canSave && (
            <p className="mt-2 text-center text-xs text-muted">
              Fyll i titel för att spara.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowMore(!showMore)}
          className="w-full rounded-xl py-2 text-center text-sm font-semibold text-primary"
        >
          {showMore ? "▲ Dölj mer information" : "▼ Mer information (valfritt)"}
        </button>

        {showMore && (
          <div className="space-y-4 border-t border-border pt-4">
            <Field label="Datum" value={date} onChange={setDate} type="date" />
            <Field label="Tid" value={time} onChange={setTime} type="time" />
            <Field label="E-post" value={customerEmail} onChange={setCustomerEmail} type="email" />
            <TextArea label="Beskrivning" value={description} onChange={setDescription} />
            <TextArea label="Anteckningar" value={notes} onChange={setNotes} />
            <div>
              <label className="label-upper mb-1.5 block">Bilder</label>
              <ImageUpload
                imageIds={imageIds}
                onChange={setImageIds}
                context="jobbet"
                onToast={setToast}
              />
            </div>
            <Button fullWidth size="lg" onClick={handleSave} disabled={!canSave}>
              {canSave ? "Spara jobb" : "Fyll i titel först"}
            </Button>
          </div>
        )}
      </div>

      <Toast message={toast} visible={!!toast} />
    </PageContainer>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="label-upper mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="label-upper mb-1.5 block">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="input-field resize-none"
      />
    </div>
  );
}
