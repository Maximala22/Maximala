"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ChevronRight, Briefcase } from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import StatusPill from "@/components/StatusPill";
import PageContainer from "@/components/PageContainer";
import { getActiveJobs } from "@/lib/storage";

export default function JobbPage() {
  const [jobs, setJobs] = useState(getActiveJobs());

  const refresh = () => setJobs(getActiveJobs());

  return (
    <PageContainer>
      <Header title="Jobb" subtitle={`${jobs.length} aktiva jobb`} />

      <Link href="/jobb/ny" className="mb-6 mt-5 block">
        <div className="flex items-center justify-center gap-2 rounded-[1.25rem] bg-gradient-to-r from-primary to-primaryDark px-5 py-4 font-semibold text-white shadow-warm transition active:scale-[0.98]">
          <Plus className="h-5 w-5" />
          Skapa nytt jobb
        </div>
      </Link>

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <Card className="py-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="h-7 w-7" />
            </div>
            <p className="text-lg font-semibold">Inga jobb ännu</p>
            <p className="mt-1 text-sm text-muted">
              Skapa ditt första jobb för att komma igång.
            </p>
            <Link href="/jobb/ny" className="mt-6 inline-block">
              <Button>+ Skapa jobb</Button>
            </Link>
          </Card>
        ) : (
          jobs.map((job) => (
            <Link key={job.id} href={`/jobb/${job.id}`} onClick={refresh}>
              <Card interactive className="mb-1 flex items-center gap-3 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{job.title}</p>
                  {job.customerName && (
                    <p className="text-sm text-muted">{job.customerName}</p>
                  )}
                  {job.date && (
                    <p className="mt-1 text-sm text-muted">
                      {job.date}
                      {job.time ? ` kl. ${job.time}` : ""}
                    </p>
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
    </PageContainer>
  );
}
