"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import Button from "@/components/Button";
import { setUserName, setPin, verifyPin } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pin, setPinValue] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!name.trim()) {
      setError("Skriv ditt namn.");
      return;
    }
    if (pin && !verifyPin(pin)) {
      if (localStorage.getItem("jobbminne_pin")) {
        setError("Fel PIN.");
        return;
      }
    }
    setUserName(name.trim());
    if (pin) setPin(pin);
    router.push("/hem");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center bg-background px-6 py-12 shadow-[0_0_60px_rgba(36,28,21,0.06)]">
      <BrandLogo size="large" variant="card" className="mb-10" />
      <h1 className="text-3xl font-bold tracking-tight text-text">Jobbminne</h1>
      <p className="mt-1 text-lg font-medium text-flemstromBlue">Flemströms</p>
      <p className="mb-10 text-sm text-muted">Intern arbetsapp</p>

      <div className="w-full space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-muted">Ditt namn</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="t.ex. Bo"
            className="w-full rounded-2xl border border-border bg-card px-4 py-4 text-base shadow-card outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-muted">PIN (frivilligt)</label>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPinValue(e.target.value)}
            placeholder="t.ex. 1234"
            className="w-full rounded-2xl border border-border bg-card px-4 py-4 text-base shadow-card outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button fullWidth size="lg" onClick={handleLogin}>
          Logga in
        </Button>
        <p className="pt-2 text-center text-xs leading-relaxed text-muted">
          Intern arbetsapp · All data sparas lokalt på enheten.
        </p>
      </div>
    </div>
  );
}
