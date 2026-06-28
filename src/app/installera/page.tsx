"use client";

import { useEffect, useState } from "react";
import { Smartphone, Share, Plus, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import PageContainer from "@/components/PageContainer";
import { isStandalonePwa } from "@/lib/pwa";

export default function InstalleraPage() {
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    setStandalone(isStandalonePwa());
  }, []);

  return (
    <PageContainer>
      <Header
        title="Installera som app"
        subtitle="Så här installerar du Jobbminne som app"
        backHref="/meny"
      />

      {standalone ? (
        <Card className="mt-6 border-emerald-200 bg-emerald-50">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
            <div>
              <p className="font-semibold text-emerald-900">
                Jobbminne är redan installerad som app.
              </p>
              <p className="mt-1 text-sm text-emerald-800">
                Du öppnar appen från hemskärmen utan Safari-adressfält.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card className="mt-6 flex flex-col items-center py-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-192.png?v=5"
              alt="Jobbminne appikon"
              className="h-28 w-28 rounded-[22%] object-cover shadow-lift"
            />
            <p className="mt-4 text-lg font-bold text-text">Jobbminne</p>
            <p className="text-sm font-medium text-flemstromBlue">Flemströms</p>
            <p className="mt-3 text-center text-sm text-muted">
              Så här kommer Jobbminne se ut på hemskärmen
            </p>
          </Card>

          <section className="mt-8">
            <div className="mb-3 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">iPhone (Safari)</h2>
            </div>
            <Card className="space-y-3">
              <Step n={1} text="Öppna Jobbminne i Safari." />
              <Step
                n={2}
                text='Tryck på dela-knappen (Share).'
                icon={<Share className="inline h-4 w-4" />}
              />
              <Step n={3} text='Välj "Lägg till på hemskärmen".' />
              <Step n={4} text='Tryck "Lägg till".' icon={<Plus className="inline h-4 w-4" />} />
              <Step n={5} text="Öppna Jobbminne från hemskärmen." />
            </Card>
          </section>

          <section className="mt-8">
            <div className="mb-3 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-flemstromBlue" />
              <h2 className="text-lg font-semibold">Android (Chrome)</h2>
            </div>
            <Card className="space-y-3">
              <Step n={1} text="Öppna Jobbminne i Chrome." />
              <Step n={2} text="Tryck på menyknappen (tre prickar)." />
              <Step n={3} text='Välj "Lägg till på startskärmen".' />
              <Step n={4} text='Tryck "Lägg till".' />
            </Card>
          </section>

          <Card className="mt-6 border-primary/20 bg-primary/5">
            <p className="text-sm leading-relaxed text-text">
              <strong>Tips:</strong> När appen öppnas från hemskärmen försvinner
              webbläsarens adressfält. Ta bort gammal ikon och lägg till igen om
              ikonen inte uppdateras.
            </p>
          </Card>
        </>
      )}
    </PageContainer>
  );
}

function Step({
  n,
  text,
  icon,
}: {
  n: number;
  text: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
        {n}
      </span>
      <p className="pt-0.5 text-sm leading-relaxed">
        {text} {icon}
      </p>
    </div>
  );
}
