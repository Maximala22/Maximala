"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import Button from "@/components/Button";
import { setUserName, setPin, verifyPin } from "@/lib/storage";
import { appConfig } from "@/lib/appConfig";

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
        <BrandLogo size="login" className="mb-8 w-full" />

        <h1 className="text-[2.25rem] font-extrabold tracking-tight text-text">
          {appConfig.appName}
        </h1>
        <p className="mt-2 text-center text-base font-medium text-text">
          {appConfig.tagline}
        </p>
        <p className="mt-1 text-center text-sm text-muted">{appConfig.loginSubtitle}</p>

        <div className="mt-8 w-full space-y-4">
          <div>
            <label className="label-upper mb-1.5 block">Ditt namn</label>
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
            <label className="label-upper mb-1.5 block">PIN</label>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPinValue(e.target.value)}
              placeholder="t.ex. 1234"
              className="input-field"
            />
          </div>
          {error && <p className="text-sm font-medium text-danger">{error}</p>}
          <Button
            fullWidth
            size="lg"
            onClick={handleLogin}
            className="min-h-[52px] bg-gradient-to-r from-primary to-primaryDark shadow-warm"
          >
            Logga in
          </Button>
          <p className="pt-1 text-center text-sm text-muted">
            Data sparas på enheten.
          </p>
        </div>
      </div>
    </div>
  );
}
