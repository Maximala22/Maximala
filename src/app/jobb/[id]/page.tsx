"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import StatusPill from "@/components/StatusPill";
import { getJob, archiveJob, duplicateJob } from "@/lib/storage";
import {
  phoneHref,
  smsHref,
  whatsappHref,
  mailHref,
  openMaps,
  copyToClipboard,
} from "@/lib/utils";
import { createJobIcs, downloadIcsFile, copyCalendarInfo } from "@/lib/calendar";
import { printJob } from "@/lib/print";
import { getImage } from "@/lib/imageStorage";

export default function JobbDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const job = getJob(id);
  const [copied, setCopied] = useState(false);
  const [calCopied, setCalCopied] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!job?.imageIds) return;
    job.imageIds.forEach(async (imgId) => {
      const img = await getImage(imgId);
      if (img) {
        setPreviews((p) => (p[imgId] ? p : { ...p, [imgId]: img.dataUrl }));
      }
    });
  }, [job?.imageIds]);

  if (!job) {
    return (
      <div className="p-4">
        <p>Jobbet hittades inte.</p>
        <Link href="/jobb" className="text-primary">Tillbaka</Link>
      </div>
    );
  }

  const phone = phoneHref(job.customerPhone);
  const hasPhone = !!job.customerPhone?.trim();

  return (
    <PageContainer>
      <Header title={job.title} backHref="/jobb" />
      <div className="mt-2"><StatusPill status={job.status} /></div>

      <Card className="mt-4 space-y-3">
        {job.customerName && <Row label="Kund" value={job.customerName} />}
        {job.customerPhone && <Row label="Telefon" value={job.customerPhone} />}
        {job.customerEmail && <Row label="E-post" value={job.customerEmail} />}
        {job.date && <Row label="Datum" value={`${job.date}${job.time ? ` kl. ${job.time}` : ""}`} />}
        {job.address && <Row label="Plats" value={job.address} />}
        {job.description && <Row label="Beskrivning" value={job.description} />}
        {job.notes && <Row label="Anteckningar" value={job.notes} />}
      </Card>

      {job.imageIds && job.imageIds.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.imageIds.map((imgId) =>
            previews[imgId] ? (
              <img key={imgId} src={previews[imgId]} alt="" className="h-24 w-24 rounded-xl object-cover" />
            ) : null
          )}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <ActionBtn href={phone} disabled={!hasPhone} label={hasPhone ? "Ring" : "Nummer saknas"} />
        <ActionBtn href={smsHref(job.customerPhone)} disabled={!hasPhone} label="SMS" />
        <ActionBtn href={whatsappHref(job.customerPhone)} disabled={!hasPhone} label="WhatsApp" />
        <ActionBtn href={mailHref(job.customerEmail)} disabled={!job.customerEmail} label="Mail" />
        <ActionBtn
          onClick={() => job.address && openMaps(job.address)}
          disabled={!job.address}
          label="Visa i Kartor"
        />
        <ActionBtn
          onClick={async () => {
            if (job.address) {
              await copyToClipboard(job.address);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
          }}
          disabled={!job.address}
          label={copied ? "Kopierad!" : "Kopiera adress"}
        />
        <ActionBtn
          onClick={() => {
            if (!job.date) { alert("Lägg till datum först."); return; }
            downloadIcsFile(`${job.title}.ics`, createJobIcs(job));
          }}
          label="Lägg till i kalender"
        />
        <ActionBtn
          onClick={async () => {
            if (!job.date) { alert("Lägg till datum först."); return; }
            await copyToClipboard(copyCalendarInfo(job));
            setCalCopied(true);
            setTimeout(() => setCalCopied(false), 2000);
          }}
          label={calCopied ? "Kopierad!" : "Kopiera kalenderinfo"}
        />
      </div>

      <div className="mt-4 space-y-2">
        <Button fullWidth variant="secondary" onClick={() => printJob(job)}>Skriv ut</Button>
        <Link href={`/jobb/${id}/redigera`}>
          <Button fullWidth variant="secondary">Redigera</Button>
        </Link>
        <Button fullWidth variant="secondary" onClick={() => {
          const copy = duplicateJob(id);
          if (copy) router.push(`/jobb/${copy.id}`);
        }}>Duplicera</Button>
        <Button fullWidth variant="ghost" onClick={() => {
          if (confirm("Arkivera detta jobb?")) {
            archiveJob(id);
            router.push("/jobb");
          }
        }}>Arkivera</Button>
      </div>

      {job.timeline && job.timeline.length > 0 && (
        <Card className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase text-muted">Tidslinje</p>
          {job.timeline.map((e) => (
            <div key={e.id} className="border-b border-border py-2 last:border-0 text-sm">
              <p>{e.message}</p>
              <p className="text-xs text-muted">{new Date(e.createdAt).toLocaleString("sv-SE")}</p>
            </div>
          ))}
        </Card>
      )}
    </PageContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function ActionBtn({
  label,
  href,
  onClick,
  disabled,
}: {
  label: string;
  href?: string | null;
  onClick?: () => void;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <button disabled className="rounded-2xl border border-border bg-background px-3 py-3 text-sm text-muted opacity-50">
        {label}
      </button>
    );
  }
  if (href) {
    return (
      <a href={href} className="rounded-2xl border border-border bg-card px-3 py-3 text-center text-sm font-medium active:bg-background">
        {label}
      </a>
    );
  }
  return (
    <button onClick={onClick} className="rounded-2xl border border-border bg-card px-3 py-3 text-sm font-medium active:bg-background">
      {label}
    </button>
  );
}
