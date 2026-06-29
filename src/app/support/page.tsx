"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail } from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { getUserName } from "@/lib/storage";
import { appConfig, getSupportMailto } from "@/lib/appConfig";

export default function SupportPage() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const canSend = subject.trim().length > 0 && message.trim().length > 0;
  const hasSupportEmail = !!appConfig.supportEmail;

  const handleContact = () => {
    if (!canSend || !hasSupportEmail) return;
    const userName = name || getUserName() || "";
    const body = `Namn: ${userName}\nÄrende: ${subject}\n\n${message}`;
    const href = getSupportMailto(`Support ${appConfig.appName}: ${subject}`, body);
    if (href) window.location.href = href;
  };

  return (
    <PageContainer>
      <Header title="Support & hjälp" subtitle="Få hjälp med appen." />

      <div className="mt-4 grid grid-cols-1 gap-2.5">
        <Link href="/ai">
          <Card interactive className="flex items-center gap-3 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-aiPurpleLight text-aiPurple">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">Hjälp att skriva</p>
              <p className="text-sm text-muted">Rapporter, SMS och mejl</p>
            </div>
          </Card>
        </Link>

        {hasSupportEmail && (
          <button type="button" onClick={() => setShowForm(!showForm)} className="w-full text-left">
            <Card interactive className="flex items-center gap-3 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-flemstromBlueLight text-flemstromBlue">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold">Kontakta support</p>
                <p className="text-sm text-muted">Skickas till {appConfig.supportName}</p>
              </div>
            </Card>
          </button>
        )}
      </div>

      {showForm && hasSupportEmail && (
        <Card className="mt-4 space-y-3">
          <p className="text-sm text-muted">Skickas som e-post till {appConfig.supportName}.</p>
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
            {canSend ? "Skicka via mail" : "Skriv ett meddelande för att skicka"}
          </Button>
        </Card>
      )}

      <section className="mt-6">
        <SectionTitle>Vanliga frågor</SectionTitle>
        <div className="space-y-2">
          <HelpItem title="Skapa jobb" text="Gå till Jobb → Skapa jobb. Fyll i titel och kund." />
          <HelpItem title="Lägg dagsrapport" text="Tryck Lägg dagsrapport på startsidan eller under Dagsrapport." />
          <HelpItem title="Spara backup" text="Gå till Meny → Exportera backup." />
          <HelpItem title="Ring någon" text="Öppna Snabbkontakter och tryck Ring." />
        </div>
      </section>
    </PageContainer>
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
