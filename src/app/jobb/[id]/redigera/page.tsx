"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import ImageUpload from "@/components/ImageUpload";
import { getJob, updateJob } from "@/lib/storage";
import { JOB_STATUSES, type JobStatus } from "@/lib/types";

export default function RedigeraJobbPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const existing = getJob(id);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [customerName, setCustomerName] = useState(existing?.customerName ?? "");
  const [customerPhone, setCustomerPhone] = useState(existing?.customerPhone ?? "");
  const [address, setAddress] = useState(existing?.address ?? "");
  const [status, setStatus] = useState<JobStatus>(existing?.status ?? "Ej planerat");
  const [date, setDate] = useState(existing?.date ?? "");
  const [time, setTime] = useState(existing?.time ?? "");
  const [customerEmail, setCustomerEmail] = useState(existing?.customerEmail ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [imageIds, setImageIds] = useState<string[]>(existing?.imageIds ?? []);

  if (!existing) {
    return <div className="p-4">Jobbet hittades inte.</div>;
  }

  const handleSave = () => {
    updateJob(id, {
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
    router.push(`/jobb/${id}`);
  };

  return (
    <PageContainer>
      <Header title="Redigera jobb" backHref={`/jobb/${id}`} />
      <div className="mt-4 space-y-4">
        <Field label="Titel" value={title} onChange={setTitle} />
        <Field label="Kundnamn" value={customerName} onChange={setCustomerName} />
        <Field label="Telefon" value={customerPhone} onChange={setCustomerPhone} type="tel" />
        <Field label="Adress / plats" value={address} onChange={setAddress} placeholder="t.ex. Handelsvägen 9, Luleå" />
        <div>
          <label className="mb-1 block text-sm text-muted">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)} className="w-full rounded-2xl border border-border bg-card px-4 py-3">
            {JOB_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <Field label="Datum" value={date} onChange={setDate} type="date" />
        <Field label="Tid" value={time} onChange={setTime} type="time" />
        <Field label="E-post" value={customerEmail} onChange={setCustomerEmail} type="email" />
        <TextArea label="Beskrivning" value={description} onChange={setDescription} />
        <TextArea label="Anteckningar" value={notes} onChange={setNotes} />
        <ImageUpload imageIds={imageIds} onChange={setImageIds} />
        <Button fullWidth size="lg" onClick={handleSave}>Spara ändringar</Button>
      </div>
    </PageContainer>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-muted">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-border bg-card px-4 py-3" />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-muted">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full rounded-2xl border border-border bg-card px-4 py-3" />
    </div>
  );
}
