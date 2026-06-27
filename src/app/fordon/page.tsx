"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin, Printer, Pencil, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Card from "@/components/Card";
import Button from "@/components/Button";
import SearchablePicker from "@/components/SearchablePicker";
import ImageUpload from "@/components/ImageUpload";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import {
  getWorkLogsForDate,
  getTotalHoursForDate,
  createWorkLog,
  updateWorkLog,
  deleteWorkLog,
  searchStaff,
  searchVehicles,
  getActiveVehicles,
  getActiveStaff,
} from "@/lib/fleetStorage";
import { formatHours, openMaps, todayISO } from "@/lib/utils";
import { printWorkLog } from "@/lib/print";

export default function FordonPage() {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [, refresh] = useState(0);

  const logs = getWorkLogsForDate(selectedDate);
  const totalHours = getTotalHoursForDate(selectedDate);

  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split("T")[0]);
  };

  return (
    <PageContainer>
      <Header
        title="Fordon & personal"
        subtitle="Planera vem som kör vad och skriv vad som gjorts idag."
      />

      <Card className="mt-5 flex items-center justify-between py-3">
        <button
          onClick={() => shiftDate(-1)}
          className="flex items-center gap-1 rounded-xl px-2 py-2 text-sm font-medium text-primary transition active:opacity-70"
        >
          <ChevronLeft className="h-4 w-4" />
          Föregående
        </button>
        <button
          onClick={() => setSelectedDate(todayISO())}
          className="rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
        >
          Idag
        </button>
        <button
          onClick={() => shiftDate(1)}
          className="flex items-center gap-1 rounded-xl px-2 py-2 text-sm font-medium text-primary transition active:opacity-70"
        >
          Nästa
          <ChevronRight className="h-4 w-4" />
        </button>
      </Card>
      <p className="mt-2 text-center text-sm text-muted">
        {new Date(selectedDate).toLocaleDateString("sv-SE", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </p>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle className="mb-0">Dagens rapporter</SectionTitle>
          <p className="text-sm font-bold text-primary">
            Totalt: {formatHours(totalHours)} h
          </p>
        </div>
        {logs.length === 0 ? (
          <Card className="py-6 text-center">
            <p className="text-muted">Inga rapporter idag. Lägg till dagens rapport.</p>
          </Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id} className="mb-3">
              <p className="font-semibold">
                {log.driverName ?? "–"} · {log.vehicleName ?? "–"}
              </p>
              {log.place && (
                <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                  <MapPin className="h-3.5 w-3.5" />
                  {log.place}
                </p>
              )}
              {log.hours !== undefined && (
                <p className="mt-1 text-sm">
                  <span className="text-muted">Timmar: </span>
                  <span className="font-semibold">{formatHours(log.hours)} h</span>
                </p>
              )}
              {log.description && (
                <p className="mt-1 text-sm text-muted">Gjort: {log.description}</p>
              )}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {log.place && (
                  <ActionChip icon={MapPin} label="Karta" onClick={() => openMaps(log.place!)} />
                )}
                <ActionChip icon={Printer} label="Skriv ut" onClick={() => printWorkLog(log)} />
                <ActionChip
                  icon={Pencil}
                  label="Redigera"
                  onClick={() => {
                    setEditingId(log.id);
                    setShowForm(true);
                  }}
                />
                <ActionChip
                  icon={Trash2}
                  label="Ta bort"
                  danger
                  onClick={() => {
                    if (confirm("Ta bort rapporten?")) {
                      deleteWorkLog(log.id);
                      refresh((n) => n + 1);
                    }
                  }}
                />
              </div>
            </Card>
          ))
        )}
      </section>

      <Button
        fullWidth
        className="mt-5"
        onClick={() => {
          setEditingId(null);
          setShowForm(!showForm);
        }}
      >
        {showForm ? "Dölj formulär" : "Lägg till dagsrapport"}
      </Button>

      {showForm && (
        <WorkLogForm
          date={selectedDate}
          editId={editingId}
          onSave={() => {
            setShowForm(false);
            setEditingId(null);
            refresh((n) => n + 1);
          }}
        />
      )}

      <section className="mt-10">
        <SectionTitle>Fordon ({getActiveVehicles().length})</SectionTitle>
        <Card className="max-h-52 overflow-auto divide-y divide-border">
          {getActiveVehicles().map((v) => (
            <p key={v.id} className="py-2.5 text-sm">{v.name}</p>
          ))}
        </Card>
      </section>

      <section className="mt-6">
        <SectionTitle>Personal ({getActiveStaff().length})</SectionTitle>
        <Card className="max-h-52 overflow-auto divide-y divide-border">
          {getActiveStaff().map((s) => (
            <p key={s.id} className="py-2.5 text-sm">{s.name}</p>
          ))}
        </Card>
      </section>
    </PageContainer>
  );
}

function ActionChip({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2.5 text-sm font-medium transition active:scale-[0.98] ${
        danger ? "text-danger" : "text-text"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function WorkLogForm({
  date,
  editId,
  onSave,
}: {
  date: string;
  editId: string | null;
  onSave: () => void;
}) {
  const existing = editId ? getWorkLogsForDate(date).find((l) => l.id === editId) : null;
  const [driverName, setDriverName] = useState(existing?.driverName ?? "");
  const [driverId, setDriverId] = useState(existing?.staffId ?? "");
  const [vehicleName, setVehicleName] = useState(existing?.vehicleName ?? "");
  const [vehicleId, setVehicleId] = useState(existing?.vehicleId ?? "");
  const [place, setPlace] = useState(existing?.place ?? "");
  const [hours, setHours] = useState(existing?.hours?.toString() ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [imageIds, setImageIds] = useState<string[]>(existing?.imageIds ?? []);
  const [saved, setSaved] = useState(false);

  const staffSearch = useCallback(
    (q: string) =>
      searchStaff(q).map((s) => ({ id: s.id, label: s.name, sublabel: s.role })),
    []
  );

  const vehicleSearch = useCallback(
    (q: string) =>
      searchVehicles(q).map((v) => ({
        id: v.id,
        label: v.name,
        sublabel: `${v.type}${v.regNumber ? ` · ${v.regNumber}` : ""}`,
      })),
    []
  );

  const handleSubmit = () => {
    const data = {
      date,
      driverName: driverName || undefined,
      staffId: driverId || undefined,
      vehicleName: vehicleName || undefined,
      vehicleId: vehicleId || undefined,
      place: place || undefined,
      hours: hours ? parseFloat(hours.replace(",", ".")) : undefined,
      description: description || undefined,
      imageIds,
    };
    if (editId) updateWorkLog(editId, data);
    else createWorkLog(data);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onSave();
    }, 800);
  };

  return (
    <Card className="mt-5 space-y-5">
      <p className="text-lg font-semibold">
        {editId ? "Redigera rapport" : "Ny dagsrapport"}
      </p>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">Datum</label>
        <input
          type="date"
          value={date}
          disabled
          className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-muted"
        />
      </div>
      <SearchablePicker
        label="Vald förare"
        icon="person"
        placeholder="Sök förare/person…"
        options={staffSearch("")}
        value={driverName}
        selectedLabel={driverName || undefined}
        onChange={(val, _label, id) => {
          setDriverName(val);
          setDriverId(id ?? "");
        }}
        onSearch={staffSearch}
      />
      <SearchablePicker
        label="Valt fordon"
        icon="vehicle"
        placeholder="Sök fordon, regnummer eller maskin…"
        options={vehicleSearch("")}
        value={vehicleName}
        selectedLabel={vehicleName || undefined}
        onChange={(val, _label, id) => {
          setVehicleName(val);
          setVehicleId(id ?? "");
        }}
        onSearch={vehicleSearch}
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">Plats/adress</label>
        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="t.ex. Handelsvägen 9, Luleå"
          className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">Antal timmar</label>
        <div className="flex items-center overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <input
            type="text"
            inputMode="decimal"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="7.5"
            className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3.5 text-lg font-semibold outline-none"
          />
          <span className="border-l border-border bg-background px-4 py-3.5 font-semibold text-muted">
            h
          </span>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-muted">Vad har gjorts?</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-border bg-card px-4 py-3.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      <ImageUpload imageIds={imageIds} onChange={setImageIds} />
      <Button fullWidth onClick={handleSubmit}>
        {saved ? "Sparat!" : "Spara rapport"}
      </Button>
    </Card>
  );
}
