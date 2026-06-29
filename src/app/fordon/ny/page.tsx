"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import Toast from "@/components/Toast";
import WorkLogForm from "@/components/WorkLogForm";
import { todayISO } from "@/lib/utils";
import { useState } from "react";

export default function NyDagsrapportPage() {
  return (
    <Suspense
      fallback={
        <PageContainer compact>
          <Header title="Ny dagsrapport" backHref="/fordon" />
          <p className="mt-8 text-center text-muted">Laddar…</p>
        </PageContainer>
      }
    >
      <NyDagsrapportForm />
    </Suspense>
  );
}

function NyDagsrapportForm() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") || todayISO();
  const editId = searchParams.get("edit");
  const [toast, setToast] = useState("");

  return (
    <PageContainer compact>
      <Header
        title={editId ? "Redigera rapport" : "Ny dagsrapport"}
        subtitle="Fyll i vem, vad och hur länge"
        backHref={`/fordon?date=${date}`}
      />

      <div className="mt-4">
        <WorkLogForm
          date={date}
          editId={editId}
          onToast={(msg) => {
            setToast(msg);
            setTimeout(() => setToast(""), 2000);
          }}
        />
      </div>

      <Toast message={toast} visible={!!toast} />
    </PageContainer>
  );
}
