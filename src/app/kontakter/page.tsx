"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
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
  const favorites = contacts.filter((c) => c.favorite);
  const others = contacts.filter((c) => !c.favorite);

  return (
    <PageContainer>
      <Header
        title="Snabbkontakter"
        subtitle="Ring, SMS, WhatsApp och mail"
      />

      <input
        type="search"
        placeholder="Sök kontakt, företag eller roll…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input-field mt-4"
      />

      {favorites.length > 0 && (
        <section className="mt-5">
          <SectionTitle>Favoriter</SectionTitle>
          <div className="space-y-2">
            {favorites.map((c) => (
              <ContactCard key={c.id} contact={c} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-5">
        <SectionTitle>{favorites.length > 0 ? "Alla kontakter" : "Kontakter"}</SectionTitle>
        <div className="space-y-2">
          {(favorites.length > 0 ? others : contacts).map((c) => (
            <ContactCard key={c.id} contact={c} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

function ContactCard({
  contact: c,
}: {
  contact: ReturnType<typeof searchContacts>[number];
}) {
  const hasPhone = !!c.phone?.trim();

  return (
    <Card className="py-3">
      <div>
        <p className="font-semibold">
          {c.name}
          {c.favorite && <span className="ml-1 text-amber-500">★</span>}
        </p>
        <p className="text-sm text-muted">
          {c.role}
          {c.company ? ` · ${c.company}` : ""}
        </p>
        {c.phone ? (
          <p className="text-sm">{c.phone}</p>
        ) : (
          <p className="text-xs text-muted/70">Telefonnummer saknas</p>
        )}
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
        <ContactBtn href={phoneHref(c.phone)} disabled={!hasPhone} label="Ring" primary={hasPhone} />
        <ContactBtn href={smsHref(c.phone)} disabled={!hasPhone} label="SMS" />
        <ContactBtn href={whatsappHref(c.phone)} disabled={!hasPhone} label="WhatsApp" />
        <ContactBtn href={mailHref(c.email)} disabled={!c.email} label="Mail" primary={!!c.email} />
        {c.address && (
          <ContactBtn onClick={() => openMaps(c.address!)} label="Karta" className="col-span-2" />
        )}
      </div>
    </Card>
  );
}

function ContactBtn({
  label,
  href,
  onClick,
  disabled,
  primary,
  className = "",
}: {
  label: string;
  href?: string | null;
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
  className?: string;
}) {
  const base = `rounded-xl px-3 py-2 text-center text-sm font-medium ${className}`;

  if (disabled) {
    return (
      <span className={`${base} bg-background text-muted/50`}>{label}</span>
    );
  }

  const styles = primary
    ? `${base} border border-primary/30 bg-primary/10 text-primary`
    : `${base} border border-border bg-card`;

  if (href) {
    return (
      <a href={href} className={styles}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={styles}>
      {label}
    </button>
  );
}
