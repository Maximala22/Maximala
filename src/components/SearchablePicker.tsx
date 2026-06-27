"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronRight, User, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { id: string; label: string; sublabel?: string };

type SearchablePickerProps = {
  placeholder: string;
  options: Option[];
  value: string;
  selectedLabel?: string;
  onChange: (value: string, label: string, id?: string) => void;
  onSearch: (query: string) => Option[];
  allowManual?: boolean;
  label?: string;
  icon?: "person" | "vehicle";
};

export default function SearchablePicker({
  placeholder,
  options,
  value,
  selectedLabel,
  onChange,
  onSearch,
  allowManual = true,
  label,
  icon = "person",
}: SearchablePickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState<Option[]>(options);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = icon === "vehicle" ? Truck : User;

  useEffect(() => {
    setFiltered(onSearch(query));
  }, [query, onSearch]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-muted">{label}</label>
      )}
      {selectedLabel && !open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-gradient-to-r from-background to-card px-4 py-3.5 text-left shadow-card transition active:scale-[0.99]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">{label ?? "Vald"}</p>
            <p className="truncate font-semibold text-text">{selectedLabel}</p>
          </div>
          <span className="shrink-0 text-sm font-medium text-primary">Ändra</span>
        </button>
      ) : (
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder={placeholder}
            value={query || value}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              if (allowManual) onChange(e.target.value, e.target.value);
            }}
            onFocus={() => setOpen(true)}
            className="w-full rounded-2xl border border-border bg-card py-3.5 pl-11 pr-4 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      )}
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-2 max-h-52 w-full overflow-auto rounded-2xl border border-border bg-card py-1 shadow-lift">
          {filtered.map((opt) => (
            <li key={opt.id}>
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-background active:bg-background"
                onClick={() => {
                  onChange(opt.label, opt.label, opt.id);
                  setQuery("");
                  setOpen(false);
                }}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{opt.label}</div>
                  {opt.sublabel && (
                    <div className="text-sm text-muted">{opt.sublabel}</div>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
