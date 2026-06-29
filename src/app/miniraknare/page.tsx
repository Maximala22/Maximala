"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";

export default function MiniraknarePage() {
  const [showCalc, setShowCalc] = useState(false);
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const input = (val: string) => {
    if (fresh) {
      setDisplay(val === "." ? "0." : val);
      setFresh(false);
    } else {
      if (val === "." && display.includes(".")) return;
      setDisplay(display === "0" && val !== "." ? val : display + val);
    }
  };

  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); setFresh(true); };
  const backspace = () => {
    if (display.length <= 1) setDisplay("0");
    else setDisplay(display.slice(0, -1));
    setFresh(false);
  };

  const operate = (nextOp: string) => {
    const current = parseFloat(display);
    if (prev !== null && op) {
      const result = calc(prev, current, op);
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(current);
    }
    setOp(nextOp);
    setFresh(true);
  };

  const equals = () => {
    if (prev === null || !op) return;
    const result = calc(prev, parseFloat(display), op);
    setDisplay(String(result));
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const calc = (a: number, b: number, operation: string): number => {
    switch (operation) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  return (
    <PageContainer>
      <Header
        title="Miniräknare"
        subtitle="Timmar, priser och mått för jobbet."
      />

      <section className="mt-4 space-y-2">
        <SectionTitle>Arbetsräknare</SectionTitle>
        <WorkCalc title="Timmar × timpris" fields={["Timmar", "Timpris (kr)"]} calc={(a, b) => `${(a * b).toLocaleString("sv-SE")} kr`} />
        <WorkCalc title="Antal × pris" fields={["Antal", "Pris (kr)"]} calc={(a, b) => `${(a * b).toLocaleString("sv-SE")} kr`} />
        <WorkCalc title="Längd × bredd" fields={["Längd (m)", "Bredd (m)"]} calc={(a, b) => `${(a * b).toLocaleString("sv-SE")} m²`} />
        <WorkCalc title="Area × pris" fields={["Area (m²)", "Pris (kr/m²)"]} calc={(a, b) => `${(a * b).toLocaleString("sv-SE")} kr`} />
      </section>

      <section className="mt-6">
        <button
          type="button"
          onClick={() => setShowCalc(!showCalc)}
          className="w-full py-2 text-center text-sm font-semibold text-primary"
        >
          {showCalc ? "▲ Dölj vanlig räknare" : "▼ Visa vanlig räknare"}
        </button>

        {showCalc && (
          <>
            <Card className="mt-3 py-3">
              <p className="text-right text-3xl font-bold tracking-tight">{display}</p>
              {op && prev !== null && (
                <p className="text-right text-xs text-muted">{prev} {op}</p>
              )}
            </Card>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              <CalcBtn label="C" onClick={clear} variant="muted" />
              <CalcBtn label="⌫" onClick={backspace} variant="muted" />
              <CalcBtn label="÷" onClick={() => operate("÷")} variant="op" />
              <CalcBtn label="×" onClick={() => operate("×")} variant="op" />
              {["7","8","9"].map((n) => <CalcBtn key={n} label={n} onClick={() => input(n)} />)}
              <CalcBtn label="-" onClick={() => operate("-")} variant="op" />
              {["4","5","6"].map((n) => <CalcBtn key={n} label={n} onClick={() => input(n)} />)}
              <CalcBtn label="+" onClick={() => operate("+")} variant="op" />
              {["1","2","3"].map((n) => <CalcBtn key={n} label={n} onClick={() => input(n)} />)}
              <CalcBtn label="=" onClick={equals} variant="primary" className="row-span-2" />
              <CalcBtn label="0" onClick={() => input("0")} className="col-span-2" />
              <CalcBtn label="." onClick={() => input(".")} />
            </div>
          </>
        )}
      </section>
    </PageContainer>
  );
}

function CalcBtn({ label, onClick, variant = "num", className = "" }: { label: string; onClick: () => void; variant?: string; className?: string }) {
  const styles: Record<string, string> = {
    num: "bg-card border-border",
    op: "bg-primary/10 text-primary border-primary/20",
    primary: "bg-primary text-white border-primary",
    muted: "bg-background text-muted border-border",
  };
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border py-3 text-lg font-semibold active:scale-95 ${styles[variant]} ${className}`}
    >
      {label}
    </button>
  );
}

function WorkCalc({ title, fields, calc }: { title: string; fields: string[]; calc: (a: number, b: number) => string }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const numA = parseFloat(a.replace(",", "."));
  const numB = parseFloat(b.replace(",", "."));
  const result = a && b && !isNaN(numA) && !isNaN(numB) ? calc(numA, numB) : null;

  return (
    <Card className="py-2.5">
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {fields.map((f, i) => (
          <input
            key={f}
            placeholder={f}
            value={i === 0 ? a : b}
            onChange={(e) => (i === 0 ? setA : setB)(e.target.value)}
            inputMode="decimal"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        ))}
      </div>
      <p className={`mt-2 text-sm font-bold ${result ? "text-primary" : "text-muted/50"}`}>
        {result ?? "–"}
      </p>
    </Card>
  );
}
