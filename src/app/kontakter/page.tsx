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
        <section className="mt-4">
          <SectionTitle>Favoriter</SectionTitle>
          <div className="space-y-2">
            {favorites.map((c) => (
              <ContactCard key={c.id} contact={c} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-4">
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
  const hasEmail = !!c.email?.trim();
  const hasAddress = !!c.address?.trim();

  const actions: { label: string; href?: string | null; onClick?: () => void; primary?: boolean }[] = [];

  if (hasPhone) {
    actions.push({ label: "Ring", href: phoneHref(c.phone), primary: true });
    actions.push({ label: "SMS", href: smsHref(c.phone) });
    actions.push({ label: "WhatsApp", href: whatsappHref(c.phone) });
  }
  if (hasEmail) {
    actions.push({ label: "Mail", href: mailHref(c.email), primary: !hasPhone });
  }
  if (hasAddress) {
    actions.push({ label: "Karta", onClick: () => openMaps(c.address!) });
  }

  return (
    <Card className="py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold leading-snug">
            {c.name}
            {c.favorite && <span className="ml-1 text-note">★</span>}
          </p>
          <p className="text-sm text-muted">
            {c.role}
            {c.company ? ` · ${c.company}` : ""}
          </p>
          {c.phone && <p className="mt-0.5 text-sm">{c.phone}</p>}
        </div>
      </div>

      <div className="mt-2 space-y-1">
        {!hasPhone && <p className="text-xs text-muted">Telefon saknas</p>}
        {!hasEmail && <p className="text-xs text-muted">Ingen e-post angiven</p>}
      </div>

      {actions.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {actions.map((a) => (
            <ContactBtn key={a.label} {...a} />
          ))}
        </div>
      )}
    </Card>
  );
}

function ContactBtn({
  label,
  href,
  onClick,
  primary,
}: {
  label: string;
  href?: string | null;
  onClick?: () => void;
  primary?: boolean;
}) {
  const styles = primary
    ? "border border-primary/30 bg-primary/10 text-primary font-semibold"
    : "border border-border bg-card text-text font-medium";

  const base = `inline-flex min-h-[40px] items-center rounded-xl px-3.5 py-2 text-sm active:scale-[0.98] ${styles}`;

  if (href) {
    return (
      <a href={href} className={base}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={base}>
      {label}
    </button>
  );
}
