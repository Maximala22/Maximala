"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  MessageSquare,
  Sparkles,
  FileText,
  HelpCircle,
  PenLine,
} from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import { copyToClipboard } from "@/lib/utils";

const QUICK_PROMPTS = [
  {
    label: "Skriv mejl",
    prompt: "Skriv ett kort och vänligt mejl till kunden om att ",
    icon: Mail,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Skriv SMS",
    prompt: "Skriv ett kort SMS till kunden om att ",
    icon: MessageSquare,
    color: "from-green-500 to-emerald-600",
  },
  {
    label: "Förbättra text",
    prompt: "Förbättra den här texten: ",
    icon: PenLine,
    color: "from-violet-500 to-purple-600",
  },
  {
    label: "Skriv arbetsrapport",
    prompt: "Skriv en tydlig arbetsrapport baserat på detta: ",
    icon: FileText,
    color: "from-amber-500 to-orange-600",
  },
  {
    label: "Förklara appen",
    prompt: "Förklara enkelt hur jag ",
    icon: HelpCircle,
    color: "from-cyan-500 to-teal-600",
  },
  {
    label: "Fråga fritt",
    prompt: "",
    icon: Sparkles,
    color: "from-primary to-primaryDark",
  },
];

type ResponseSource = "openai" | "fallback" | "error" | null;

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<ResponseSource>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const ask = async () => {
    const q = prompt.trim();
    if (!q) return;

    setLoading(true);
    setResponse("");
    setSource(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/jobbminne-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: q }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResponse("AI-tjänsten svarade inte just nu. Försök igen om en stund.");
        setSource("error");
        setLoading(false);
        return;
      }

      setResponse(data.answer ?? "Inget svar.");
      setSource(data.source ?? "fallback");
      if (data.source === "fallback" && data.error) {
        setErrorMsg("AI-tjänsten svarade inte just nu. Visar exempel.");
      }
    } catch {
      setResponse("Kunde inte nå AI just nu. Kontrollera nätverket och försök igen.");
      setSource("error");
    }

    setLoading(false);
  };

  const clearAll = () => {
    setPrompt("");
    setResponse("");
    setSource(null);
    setErrorMsg("");
  };

  return (
    <PageContainer>
      <Header
        title="Fråga Jobbminne AI"
        subtitle="Skriv mejl, SMS, rapporter eller ställ en fråga. Svaret kan du kopiera direkt."
      />

      {!response && (
        <section className="mt-4">
          <p className="mb-3 text-sm font-semibold text-text">Vad vill du göra?</p>
          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_PROMPTS.map((q) => {
              const Icon = q.icon;
              return (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => setPrompt(q.prompt)}
                  className={`flex min-h-[88px] flex-col justify-between rounded-[1.15rem] bg-gradient-to-br ${q.color} p-3.5 text-left text-white shadow-card transition active:scale-[0.98]`}
                >
                  <Icon className="h-5 w-5 opacity-90" strokeWidth={2} />
                  <span className="text-sm font-semibold leading-snug">{q.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2.5 text-xs text-muted">
            Snabbknapparna fyller bara textfältet. Du kan ändra innan du frågar.
          </p>
        </section>
      )}

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Skriv din fråga här…"
        rows={4}
        className="input-field mt-4 resize-none"
      />

      <div className="mt-3 flex gap-2">
        <Button fullWidth onClick={ask} disabled={loading || !prompt.trim()}>
          {loading ? "Tänker…" : "Fråga AI"}
        </Button>
        {(prompt || response) && (
          <Button variant="secondary" onClick={clearAll}>
            Rensa
          </Button>
        )}
      </div>

      {response && (
        <Card className="mt-4">
          {source === "openai" && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-flemstromBlue">
              AI-svar
            </p>
          )}
          {(source === "fallback" || source === "error") && (
            <p className="mb-2 text-xs font-medium text-muted">
              {errorMsg || "AI-tjänsten svarade inte just nu. Visar exempel."}
            </p>
          )}
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{response}</p>
          <div className="mt-3 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={async () => {
                await copyToClipboard(response);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Kopierad!" : "Kopiera svar"}
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Rensa
            </Button>
          </div>
        </Card>
      )}
    </PageContainer>
  );
}
