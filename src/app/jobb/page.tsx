"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ChevronRight, Briefcase, Search } from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import StatusPill from "@/components/StatusPill";
import PageContainer from "@/components/PageContainer";
import { getActiveJobs } from "@/lib/storage";

export default function JobbPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const allJobs = getActiveJobs();
  const isEmpty = allJobs.length === 0;

  const jobs = allJobs.filter((j) => {
    const matchesQuery =
      !query ||
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.customerName?.toLowerCase().includes(query.toLowerCase()) ||
      j.address?.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || j.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const statuses = ["all", "Ej planerat", "Planerad", "Pågående", "Klar", "Uppföljning"];

  return (
    <PageContainer>
      <Header title="Jobb" subtitle={`${allJobs.length} aktiva jobb`} />

      {isEmpty ? (
        <Card className="mt-4 py-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Briefcase className="h-7 w-7" />
          </div>
          <p className="text-lg font-bold">Inga jobb ännu</p>
          <p className="mt-2 text-sm text-muted">
            Skapa ditt första jobb och samla rapporter, bilder och anteckningar på ett ställe.
          </p>
          <Link href="/jobb/ny" className="mt-6 inline-block">
            <Button size="lg">Skapa jobb</Button>
          </Link>
        </Card>
      ) : (
        <>
          <Link href="/jobb/ny" className="mb-4 mt-4 block">
            <div className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-bold text-white shadow-warm transition active:scale-[0.98]">
              <Plus className="h-5 w-5" />
              Skapa jobb
            </div>
          </Link>

          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              placeholder="Sök jobb, kund eller adress…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {statuses.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  statusFilter === s
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-muted"
                }`}
              >
                {s === "all" ? "Alla" : s}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {jobs.length === 0 ? (
              <Card className="py-8 text-center">
                <p className="font-semibold">Inga jobb matchar sökningen</p>
                <p className="mt-1 text-sm text-muted">Prova ett annat sökord eller filter.</p>
              </Card>
            ) : (
              jobs.map((job) => (
                <Link key={job.id} href={`/jobb/${job.id}`}>
                  <Card interactive className="flex items-center gap-3 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{job.title}</p>
                      {job.customerName && (
                        <p className="text-sm text-muted">{job.customerName}</p>
                      )}
                      {job.address && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted">{job.address}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <StatusPill status={job.status} />
                      <ChevronRight className="h-4 w-4 text-muted" />
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </>
      )}
    </PageContainer>
  );
}
