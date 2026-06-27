"use client";

import Link from "next/link";
import { CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { getStatusSummary, getDetailedStatusItems } from "@/lib/aiStatus";

export default function StatusPage() {
  const summary = getStatusSummary();
  const details = getDetailedStatusItems();

  return (
    <PageContainer>
      <Header
        title="Att kolla"
        subtitle="Se vad som saknas eller behöver göras."
      />

      <Card
        className={`mt-5 ${
          summary.allGood
            ? "border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-green-50"
            : "border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50"
        }`}
      >
        <div className="flex items-start gap-3">
          {summary.allGood ? (
            <CheckCircle2 className="h-7 w-7 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-7 w-7 shrink-0 text-amber-600" />
          )}
          <div>
            <p
              className={`text-xl font-bold ${
                summary.allGood ? "text-emerald-800" : "text-amber-900"
              }`}
            >
              {summary.summaryText}
            </p>
            {summary.allGood ? (
              <p className="mt-2 text-sm text-muted">
                Inga viktiga saker saknas just nu.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {summary.items.map((item) => (
                  <li key={item.id} className="text-sm leading-relaxed">
                    • {item.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Card>

      {details.length > 0 && (
        <section className="mt-8">
          <SectionTitle>Saker som saknas</SectionTitle>
          <div className="space-y-2">
            {details.map((item) => (
              <Card key={item.id} interactive className="py-3.5">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-2 text-sm font-medium"
                  >
                    <span>{item.message}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
                  </Link>
                ) : (
                  <p className="text-sm">{item.message}</p>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  );
}
