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
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center bg-background px-6 py-10">
      <div className="flex w-full max-w-sm flex-col items-center">
        <BrandLogo size="login" className="mb-10 w-full" />

        <h1 className="text-[2rem] font-bold tracking-tight text-text">Jobbminne</h1>
        <p className="mt-1 text-lg font-semibold text-flemstromBlue">Flemströms</p>
        <p className="mb-8 text-sm text-muted">Intern arbetsapp</p>

        <div className="w-full space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">Ditt namn</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="t.ex. Bo"
              className="input-field"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted">PIN</label>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPinValue(e.target.value)}
              placeholder="t.ex. 1234"
              className="input-field"
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button
            fullWidth
            size="lg"
            onClick={handleLogin}
            className="bg-gradient-to-r from-primary to-primaryDark shadow-warm"
          >
            Logga in
          </Button>
          <p className="pt-1 text-center text-xs leading-relaxed text-muted">
            All data sparas lokalt på enheten.
          </p>
        </div>
      </div>
    </div>
  );
}
