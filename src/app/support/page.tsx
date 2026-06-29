"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Shield,
  BookOpen,
  Mail,
} from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { mailHref } from "@/lib/utils";
import { getUserName } from "@/lib/storage";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const canSend = subject.trim().length > 0 && message.trim().length > 0;

  const handleContact = () => {
    if (!canSend) return;
    const userName = name || getUserName() || "";
    const body = `Namn: ${userName}\nÄrende: ${subject}\n\n${message}`;
    const href = mailHref("flemstromelliot@gmail.com", `Support Jobbminne: ${subject}`, body);
    if (href) window.location.href = href;
  };

  return (
    <PageContainer>
      <Header title="Support & hjälp" subtitle="Vad behöver du hjälp med?" />

      <div className="mt-4 space-y-2.5">
        <HelpLink
          href="/ai"
          icon={Sparkles}
          title="Fråga Jobbminne AI"
          text="Få hjälp att skriva texter"
          color="bg-aiPurpleLight text-aiPurple"
        />
        <HelpLink
          href="mailto:flemstromelliot@gmail.com"
          icon={Mail}
          title="Kontakta Elliot"
          text="Skicka mail direkt"
          color="bg-flemstromBlueLight text-flemstromBlue"
        />
        <HelpLink
          href="/installera"
          icon={BookOpen}
          title="Så använder du appen"
          text="Installera på hemskärmen"
          color="bg-successLight text-success"
        />
        <HelpLink
          href="/meny"
          icon={Shield}
          title="Backup & säkerhet"
          text="Exportera och spara din data"
          color="bg-note-light text-note-dark"
        />
      </div>

      <Card className="mt-6 space-y-3">
        <p className="font-semibold">Skicka ärende via mail</p>
        <p className="text-sm text-muted">Skickas som e-post till Elliot.</p>
        <input
          placeholder="Ditt namn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          placeholder="Ärende"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-field"
        />
        <textarea
          placeholder="Meddelande"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="input-field resize-none"
        />
        <Button fullWidth onClick={handleContact} disabled={!canSend}>
          {canSend ? "Skicka via mail" : "Fyll i ärende och meddelande"}
        </Button>
      </Card>

      <section className="mt-6">
        <SectionTitle>Vanliga frågor</SectionTitle>
        <div className="space-y-2">
          <HelpItem title="Skapa jobb" text="Gå till Jobb → Skapa jobb. Fyll i titel och kund." />
          <HelpItem title="Lägg rapport" text="Gå till Fordon & personal → Lägg till dagsrapport." />
          <HelpItem title="Spara backup" text="Gå till Meny → Exportera backup." />
          <HelpItem title="Ring någon" text="Öppna Snabbkontakter och tryck Ring." />
        </div>
      </section>
    </PageContainer>
  );
}

function HelpLink({
  href,
  icon: Icon,
  title,
  text,
  color,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <Card interactive className="flex items-center gap-3 py-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted">{text}</p>
        </div>
      </Card>
    </Link>
  );
}

function HelpItem({ title, text }: { title: string; text: string }) {
  return (
    <Card className="py-3">
      <p className="font-semibold">{title}</p>
      <p className="mt-0.5 text-sm text-muted">{text}</p>
    </Card>
  );
}
