"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";

export default function MiniraknarePage() {
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
    <div className="mx-auto max-w-lg px-4 pb-6">
      <Header
        title="Miniräknare"
        subtitle="Räkna snabbt på timmar, priser och mått."
      />

      <Card className="mt-4">
        <p className="text-right text-4xl font-bold tracking-tight">{display}</p>
        {op && prev !== null && <p className="text-right text-sm text-muted">{prev} {op}</p>}
      </Card>

      <div className="mt-4 grid grid-cols-4 gap-2">
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

      <section className="mt-8 space-y-4">
        <h2 className="text-xs font-semibold uppercase text-muted">Arbetsräknare</h2>
        <WorkCalc title="Timmar × timpris" fields={["Timmar", "Timpris (kr)"]} calc={(a, b) => `${(a * b).toLocaleString("sv-SE")} kr`} />
        <WorkCalc title="Antal × pris" fields={["Antal", "Pris (kr)"]} calc={(a, b) => `${(a * b).toLocaleString("sv-SE")} kr`} />
        <WorkCalc title="Längd × bredd = area" fields={["Längd (m)", "Bredd (m)"]} calc={(a, b) => `${(a * b).toLocaleString("sv-SE")} m²`} />
      </section>
    </div>
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
      className={`rounded-2xl border py-4 text-xl font-semibold active:scale-95 ${styles[variant]} ${className}`}
    >
      {label}
    </button>
  );
}

function WorkCalc({ title, fields, calc }: { title: string; fields: string[]; calc: (a: number, b: number) => string }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const result = a && b ? calc(parseFloat(a.replace(",", ".")), parseFloat(b.replace(",", "."))) : null;

  return (
    <Card>
      <p className="font-semibold">{title}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {fields.map((f, i) => (
          <input
            key={f}
            placeholder={f}
            value={i === 0 ? a : b}
            onChange={(e) => (i === 0 ? setA : setB)(e.target.value)}
            inputMode="decimal"
            className="rounded-xl border border-border bg-background px-3 py-2"
          />
        ))}
      </div>
      {result && <p className="mt-2 text-lg font-bold text-primary">{result}</p>}
    </Card>
  );
}
