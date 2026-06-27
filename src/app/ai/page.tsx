"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import { copyToClipboard } from "@/lib/utils";

const QUICK_PROMPTS = [
  {
    label: "Skriv mejl",
    prompt:
      "Skriv ett kort och vänligt mejl till kunden om att ",
  },
  {
    label: "Skriv SMS",
    prompt: "Skriv ett kort SMS till kunden om att ",
  },
  {
    label: "Förbättra text",
    prompt: "Förbättra den här texten: ",
  },
  {
    label: "Förklara appen",
    prompt: "Förklara hur jag ",
  },
  {
    label: "Arbetsrapport",
    prompt: "Skriv en tydlig arbetsrapport baserat på detta: ",
  },
];

type ResponseSource = "openai" | "fallback" | "error" | null;

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<ResponseSource>(null);
  const [noApiKey, setNoApiKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const ask = async () => {
    const q = prompt.trim();
    if (!q) return;

    setLoading(true);
    setResponse("");
    setSource(null);
    setNoApiKey(false);
    setErrorMsg("");

    try {
      const res = await fetch("/api/jobbminne-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResponse(data.error ?? "Något gick fel.");
        setSource("error");
        setLoading(false);
        return;
      }

      setResponse(data.answer ?? "Inget svar.");
      setSource(data.source ?? "fallback");
      setNoApiKey(!!data.noApiKey);
      setErrorMsg(data.error ?? "");
    } catch {
      setResponse("Kunde inte nå AI just nu. Kontrollera nätverket och försök igen.");
      setSource("error");
    }

    setLoading(false);
  };

  return (
    <PageContainer>
      <Header
        title="Fråga Jobbminne AI"
        subtitle="Skriv vad du vill ha hjälp med — mejl, SMS, rapporter eller frågor om appen. Svaren är färdiga att kopiera."
      />

      <div className="mt-5 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={() => setPrompt(q.prompt)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium shadow-card transition active:scale-[0.98] active:bg-background"
          >
            {q.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">
        Snabbknapparna fyller bara textfältet — du kan ändra fritt innan du frågar.
      </p>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Skriv din fråga här… t.ex. ett mejl, SMS, arbetsrapport eller en fråga om appen."
        rows={5}
        className="mt-4 w-full rounded-2xl border border-border bg-card px-4 py-3.5 text-base shadow-card outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />

      <Button fullWidth className="mt-3" onClick={ask} disabled={loading || !prompt.trim()}>
        {loading ? "Tänker…" : "Fråga AI"}
      </Button>

      {response && (
        <Card className="mt-5">
          {source === "openai" && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-flemstromBlue">
              AI-svar
            </p>
          )}
          {source === "fallback" && noApiKey && (
            <p className="mb-2 text-xs font-medium leading-relaxed text-warning">
              Riktig AI är inte aktiverad ännu. Lägg till OPENAI_API_KEY i .env.local.
            </p>
          )}
          {source === "fallback" && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-warning">
              Lokalt exempel
            </p>
          )}
          {source === "error" && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-danger">
              Fel
            </p>
          )}
          {errorMsg && source === "fallback" && !noApiKey && (
            <p className="mb-2 text-xs text-muted">{errorMsg}</p>
          )}
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{response}</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={async () => {
              await copyToClipboard(response);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? "Kopierad!" : "Kopiera svar"}
          </Button>
        </Card>
      )}
    </PageContainer>
  );
}
