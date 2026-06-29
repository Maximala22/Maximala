"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import PageContainer from "@/components/PageContainer";
import Toast from "@/components/Toast";
import WorkLogForm from "@/components/WorkLogForm";
import { todayISO } from "@/lib/utils";

export default function NyDagsrapportPage() {
  return (
    <Suspense
      fallback={
        <PageContainer compact>
          <Header title="Ny dagsrapport" backHref="/dagsrapport" />
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
        subtitle="Skriv text och lägg bilder"
        backHref={`/dagsrapport?date=${date}`}
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
