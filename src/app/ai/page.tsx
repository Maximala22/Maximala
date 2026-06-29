"use client";

import { useState } from "react";
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
import Toast from "@/components/Toast";
import { copyToClipboard } from "@/lib/utils";
import { cn } from "@/lib/utils";

const QUICK_PROMPTS = [
  {
    label: "Skriv arbetsrapport",
    prompt: "Skriv en tydlig arbetsrapport baserat på detta: ",
    icon: FileText,
    iconBg: "bg-primary/12 text-primary",
    card: "border-primary/15 bg-primaryLight/40",
    featured: true,
  },
  {
    label: "Skriv mejl",
    prompt: "Skriv ett kort och vänligt mejl till kunden om att ",
    icon: Mail,
    iconBg: "bg-flemstromBlue/12 text-flemstromBlue",
    card: "border-flemstromBlue/10 bg-flemstromBlueLight/50",
  },
  {
    label: "Skriv SMS",
    prompt: "Skriv ett kort SMS till kunden om att ",
    icon: MessageSquare,
    iconBg: "bg-success/12 text-success",
    card: "border-success/10 bg-successLight/60",
  },
  {
    label: "Förbättra text",
    prompt: "Förbättra den här texten: ",
    icon: PenLine,
    iconBg: "bg-aiPurple/12 text-aiPurple",
    card: "border-aiPurple/10 bg-aiPurpleLight/50",
  },
  {
    label: "Förklara appen",
    prompt: "Förklara enkelt hur jag ",
    icon: HelpCircle,
    iconBg: "bg-utilityCyan/12 text-utilityCyan-dark",
    card: "border-utilityCyan/10 bg-utilityCyanLight/50",
  },
  {
    label: "Fråga fritt",
    prompt: "",
    icon: Sparkles,
    iconBg: "bg-background text-muted",
    card: "border-border bg-card",
  },
];

type ResponseSource = "openai" | "fallback" | "error" | null;

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<ResponseSource>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState("");

  const canAsk = prompt.trim().length > 0;

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
      setResponse("AI-tjänsten svarade inte just nu. Kontrollera nätverket och försök igen.");
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
          <div className="grid grid-cols-2 gap-2">
            {QUICK_PROMPTS.map((q) => {
              const Icon = q.icon;
              return (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => setPrompt(q.prompt)}
                  className={cn(
                    "flex min-h-[80px] flex-col justify-between rounded-[1.15rem] border p-3 text-left transition active:scale-[0.98]",
                    q.card,
                    q.featured && "col-span-2 min-h-[72px] flex-row items-center gap-3"
                  )}
                >
                  <div
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded-xl",
                      q.iconBg,
                      q.featured ? "h-10 w-10" : "h-9 w-9"
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <span
                    className={cn(
                      "font-bold leading-snug text-text",
                      q.featured ? "text-base" : "text-sm"
                    )}
                  >
                    {q.label}
                  </span>
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
        <Button fullWidth onClick={ask} disabled={loading || !canAsk}>
          {loading ? "Tänker…" : canAsk ? "Fråga AI" : "Skriv en fråga först"}
        </Button>
        {prompt.trim() && (
          <Button variant="secondary" onClick={clearAll}>
            Rensa
          </Button>
        )}
      </div>

      {response && (
        <Card className="mt-4">
          {source === "openai" && (
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-flemstromBlue">
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
                setToast("Kopierat");
                setTimeout(() => setToast(""), 2000);
              }}
            >
              Kopiera svar
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Rensa
            </Button>
          </div>
        </Card>
      )}

      <Toast message={toast} visible={!!toast} />
    </PageContainer>
  );
}
