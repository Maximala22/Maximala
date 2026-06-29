"use client";

import { useState } from "react";
import {
  Mail,
  MessageSquare,
  FileText,
  HelpCircle,
  PenLine,
  Sparkles,
} from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import Toast from "@/components/Toast";
import { copyToClipboard } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PRIMARY_PROMPTS = [
  {
    label: "Arbetsrapport",
    prompt: "Skriv en tydlig arbetsrapport baserat på detta: ",
    icon: FileText,
    iconBg: "bg-primary/12 text-primary",
  },
  {
    label: "Skriv SMS",
    prompt: "Skriv ett kort SMS till kunden om att ",
    icon: MessageSquare,
    iconBg: "bg-success/12 text-success",
  },
  {
    label: "Skriv mejl",
    prompt: "Skriv ett kort och vänligt mejl till kunden om att ",
    icon: Mail,
    iconBg: "bg-flemstromBlue/12 text-flemstromBlue",
  },
];

const MORE_PROMPTS = [
  {
    label: "Förbättra text",
    prompt: "Förbättra den här texten: ",
    icon: PenLine,
    iconBg: "bg-aiPurple/12 text-aiPurple",
  },
  {
    label: "Förklara appen",
    prompt: "Förklara enkelt hur jag ",
    icon: HelpCircle,
    iconBg: "bg-utilityCyan/12 text-utilityCyan-dark",
  },
  {
    label: "Fråga fritt",
    prompt: "",
    icon: Sparkles,
    iconBg: "bg-background text-muted",
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
  const [showMore, setShowMore] = useState(false);

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

  const PromptBtn = ({
    label,
    prompt: p,
    icon: Icon,
    iconBg,
  }: {
    label: string;
    prompt: string;
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
  }) => (
    <button
      type="button"
      onClick={() => setPrompt(p)}
      className="flex min-h-[52px] w-full items-center gap-3 rounded-2xl border border-border bg-card px-3.5 py-3 text-left transition active:scale-[0.98]"
    >
      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", iconBg)}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-bold">{label}</span>
    </button>
  );

  return (
    <PageContainer>
      <Header
        title="Hjälp att skriva"
        subtitle="Få hjälp att skriva rapporter, SMS och mejl."
      />

      {!response && (
        <section className="mt-4 space-y-2">
          {PRIMARY_PROMPTS.map((q) => (
            <PromptBtn key={q.label} {...q} />
          ))}
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="w-full py-2 text-center text-sm font-semibold text-primary"
          >
            {showMore ? "▲ Färre val" : "▼ Fler val"}
          </button>
          {showMore &&
            MORE_PROMPTS.map((q) => <PromptBtn key={q.label} {...q} />)}
        </section>
      )}

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Skriv din fråga här…"
        rows={4}
        className="input-field mt-4 resize-none"
      />

      {!canAsk && !loading && (
        <p className="mt-2 text-xs text-muted">
          Skriv något eller välj en snabbknapp.
        </p>
      )}

      <div className="mt-3 flex gap-2">
        <Button fullWidth onClick={ask} disabled={loading || !canAsk}>
          {loading ? "Tänker…" : canAsk ? "Fråga AI" : "Skriv något först"}
        </Button>
        {prompt.trim() && (
          <Button variant="secondary" onClick={clearAll}>
            Rensa
          </Button>
        )}
      </div>

      {response && (
        <Card className="mt-4">
          {(source === "fallback" || source === "error") && (
            <p className="mb-2 text-xs font-medium text-muted">
              {errorMsg || "AI-tjänsten svarade inte just nu."}
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
