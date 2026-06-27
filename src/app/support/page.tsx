"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { mailHref } from "@/lib/utils";
import { getUserName } from "@/lib/storage";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleContact = () => {
    const userName = name || getUserName() || "";
    const body = `Namn: ${userName}\nÄrende: ${subject}\n\n${message}\n\n---\nTeknisk info:\n${navigator.userAgent}\n${window.location.href}`;
    const href = mailHref("flemstromelliot@gmail.com", `Support Jobbminne: ${subject}`, body);
    if (href) window.location.href = href;
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-6">
      <Header title="Support & hjälp" subtitle="Få hjälp med Jobbminne" />

      <Link href="/ai" className="mt-4 block">
        <Card className="bg-purple-50">
          <p className="font-semibold text-purple-800">Fråga Jobbminne AI</p>
          <p className="text-sm text-muted">Få hjälp att skriva texter och förstå appen.</p>
        </Card>
      </Link>

      <Card className="mt-4 space-y-4">
        <p className="font-semibold">Kontakta Elliot</p>
        <input placeholder="Ditt namn" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-border bg-background px-4 py-3" />
        <input placeholder="Ärende" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-2xl border border-border bg-background px-4 py-3" />
        <textarea placeholder="Meddelande" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full rounded-2xl border border-border bg-background px-4 py-3" />
        <Button fullWidth onClick={handleContact} disabled={!subject || !message}>Skicka via mail</Button>
      </Card>

      <section className="mt-6 space-y-3">
        <h2 className="text-xs font-semibold uppercase text-muted">Hjälp</h2>
        <HelpItem title="Skapa jobb" text="Gå till Jobb → Skapa nytt jobb. Fyll i titel och kundinfo." />
        <HelpItem title="Dagsrapport" text="Gå till Fordon & personal → Lägg till dagsrapport." />
        <HelpItem title="Backup" text="Gå till Meny → Exportera backup. Spara filen på en säker plats." />
        <HelpItem title="Kontakter" text="All personal syns under Snabbkontakter. Ring eller SMS direkt." />
      </section>
    </div>
  );
}

function HelpItem({ title, text }: { title: string; text: string }) {
  return (
    <Card>
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted">{text}</p>
    </Card>
  );
}
