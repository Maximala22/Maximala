"use client";

import Link from "next/link";
import { CheckCircle2, AlertCircle, Plus, ClipboardList, StickyNote, Shield, Download } from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import {
  getDetailedStatusItems,
  getStatusSummary,
} from "@/lib/aiStatus";
import { getLastBackupAt } from "@/lib/storage";
import { downloadBackup } from "@/lib/backup";
import { todayISO } from "@/lib/utils";
import { appConfig } from "@/lib/appConfig";

export default function StatusPage() {
  const full = getStatusSummary();
  const details = getDetailedStatusItems();
  const lastBackup = getLastBackupAt();
  const hasBackupIssue = full.items.some((i) => i.id.startsWith("no-backup") || i.id.startsWith("old-backup"));

  return (
    <PageContainer>
      <Header title="Att kolla" subtitle="Viktiga saker som behöver göras." />

      <Card
        className={`mt-4 ${
          full.allGood
            ? "border-success/20 bg-successLight"
            : "border-warning/20 bg-warning-light"
        }`}
      >
        <div className="flex items-start gap-3">
          {full.allGood ? (
            <CheckCircle2 className="h-7 w-7 shrink-0 text-success" />
          ) : (
            <AlertCircle className="h-7 w-7 shrink-0 text-warning" />
          )}
          <div>
            <p className="text-xl font-bold text-text">{full.summaryText}</p>
            {full.allGood ? (
              <p className="mt-2 text-sm text-muted">Inga viktiga saker saknas just nu.</p>
            ) : (
              <ul className="mt-3 space-y-1.5">
                {full.items.map((item) => (
                  <li key={item.id} className="text-sm leading-relaxed">
                    • {item.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>

      {full.allGood && (
        <div className="mt-4 grid grid-cols-1 gap-2">
          <Link href="/jobb/ny">
            <Button fullWidth variant="secondary" className="justify-start gap-2">
              <Plus className="h-4 w-4" /> Skapa jobb
            </Button>
          </Link>
          <Link href={`/fordon/ny?date=${todayISO()}`}>
            <Button fullWidth variant="secondary" className="justify-start gap-2">
              <ClipboardList className="h-4 w-4" /> Lägg rapport
            </Button>
          </Link>
          <Link href="/anteckningar">
            <Button fullWidth variant="secondary" className="justify-start gap-2">
              <StickyNote className="h-4 w-4" /> Ny anteckning
            </Button>
          </Link>
        </div>
      )}

      {details.length > 0 && (
        <section className="mt-6">
          <SectionTitle>Saker som saknas</SectionTitle>
          <div className="space-y-2">
            {details.map((item) => (
              <Card key={item.id} interactive className="py-3">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-2 text-sm font-medium"
                  >
                    <span>{item.message}</span>
                    <span className="text-primary">→</span>
                  </Link>
                ) : (
                  <p className="text-sm">{item.message}</p>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <SectionTitle>Backup</SectionTitle>
        <Card className="border-flemstromBlue/15 bg-flemstromBlueLight/50 p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-6 w-6 shrink-0 text-flemstromBlue" />
            <div className="min-w-0 flex-1">
              {hasBackupIssue ? (
                <>
                  <p className="font-bold text-text">Spara en kopia</p>
                  <p className="mt-1 text-sm text-muted">
                    {appConfig.backupDescription}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-text">Backup finns</p>
                  <p className="mt-1 text-sm text-muted">
                    Senaste backup:{" "}
                    {lastBackup
                      ? new Date(lastBackup).toLocaleDateString("sv-SE")
                      : "–"}
                  </p>
                </>
              )}
              <Button
                fullWidth
                size="sm"
                variant="secondary"
                className="mt-3 gap-2"
                onClick={downloadBackup}
              >
                <Download className="h-4 w-4" />
                Exportera backup
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </PageContainer>
  );
}
