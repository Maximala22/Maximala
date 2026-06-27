"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import { searchContacts } from "@/lib/contacts";
import {
  phoneHref,
  smsHref,
  whatsappHref,
  mailHref,
  openMaps,
} from "@/lib/utils";

export default function KontakterPage() {
  const [query, setQuery] = useState("");
  const contacts = searchContacts(query);

  return (
    <div className="mx-auto max-w-lg px-4 pb-6">
      <Header
        title="Snabbkontakter"
        subtitle="Ring, SMS, WhatsApp och mail"
      />
      <input
        type="search"
        placeholder="Sök kontakt, företag eller roll…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mt-4 w-full rounded-2xl border border-border bg-card px-4 py-3"
      />
      <div className="mt-4 space-y-3">
        {contacts.map((c) => {
          const hasPhone = !!c.phone?.trim();
          return (
            <Card key={c.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{c.name} {c.favorite && "⭐"}</p>
                  <p className="text-sm text-muted">{c.role}{c.company ? ` · ${c.company}` : ""}</p>
                  {c.phone && <p className="text-sm">{c.phone}</p>}
                  {c.email && <p className="text-sm">{c.email}</p>}
                  {c.address && <p className="text-sm text-muted">{c.address}</p>}
                  {c.tags && c.tags.length > 0 && (
                    <div className="mt-1 flex gap-1">
                      {c.tags.map((t) => (
                        <span key={t} className="rounded-full bg-background px-2 py-0.5 text-xs text-muted">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <ContactBtn href={phoneHref(c.phone)} disabled={!hasPhone} label={hasPhone ? "Ring" : "Nummer saknas"} />
                <ContactBtn href={smsHref(c.phone)} disabled={!hasPhone} label="SMS" />
                <ContactBtn href={whatsappHref(c.phone)} disabled={!hasPhone} label="WhatsApp" />
                <ContactBtn href={mailHref(c.email)} disabled={!c.email} label="Mail" />
                {c.address && (
                  <ContactBtn onClick={() => openMaps(c.address!)} label="Karta" />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ContactBtn({
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
    return <button disabled className="rounded-xl bg-background px-3 py-2 text-sm text-muted opacity-50">{label}</button>;
  }
  if (href) {
    return <a href={href} className="rounded-xl border border-border bg-card px-3 py-2 text-center text-sm font-medium">{label}</a>;
  }
  return <button onClick={onClick} className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium">{label}</button>;
}
