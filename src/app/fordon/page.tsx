"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin, Printer, Pencil, Trash2, Search } from "lucide-react";
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
  resetFleetDefaults,
} from "@/lib/fleetStorage";
import { formatHours, openMaps, todayISO, addDaysISO, isoToLocalDate } from "@/lib/utils";
import { printWorkLog } from "@/lib/print";

const LIST_LIMIT = 6;

export default function FordonPage() {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllVehicles, setShowAllVehicles] = useState(false);
  const [showAllStaff, setShowAllStaff] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [, refresh] = useState(0);

  const logs = getWorkLogsForDate(selectedDate);
  const totalHours = getTotalHoursForDate(selectedDate);
  const isToday = selectedDate === todayISO();
  const vehicleCount = getActiveVehicles().length;
  const staffCount = getActiveStaff().length;

  const vehicles = getActiveVehicles().filter(
    (v) =>
      !searchQuery ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.regNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const staff = getActiveStaff().filter(
    (s) =>
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleVehicles = showAllVehicles ? vehicles : vehicles.slice(0, LIST_LIMIT);
  const visibleStaff = showAllStaff ? staff : staff.slice(0, LIST_LIMIT);

  const shiftDate = (days: number) => {
    setSelectedDate(addDaysISO(selectedDate, days));
  };

  const openNewReport = () => {
    setEditingId(null);
    setShowForm(true);
  };

  return (
    <PageContainer>
      <Header
        title="Fordon & personal"
        subtitle="Lägg dagsrapport snabbt — vem körde vad och vad gjordes."
      />

      <Card className="mt-4 flex items-center justify-between py-2.5">
        <button
          onClick={() => shiftDate(-1)}
          className="flex items-center gap-1 rounded-xl px-2 py-2 text-sm font-medium text-primary transition active:opacity-70"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-center">
          <button
            onClick={() => setSelectedDate(todayISO())}
            className="rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"
          >
            {isToday ? "Idag" : "Gå till idag"}
          </button>
          <p className="mt-1 text-xs text-muted">
            {new Date(isoToLocalDate(selectedDate)).toLocaleDateString("sv-SE", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
            {!isToday && " · annan dag"}
          </p>
        </div>
        <button
          onClick={() => shiftDate(1)}
          className="flex items-center gap-1 rounded-xl px-2 py-2 text-sm font-medium text-primary transition active:opacity-70"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </Card>

      <Card className="mt-3 flex items-center justify-between py-3">
        <p className="text-sm text-muted">Total rapporttid</p>
        <p className="text-lg font-bold text-primary">{formatHours(totalHours)} h</p>
      </Card>

      {savedToast && (
        <div className="fixed bottom-[calc(120px+env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2 rounded-full bg-success px-5 py-2.5 text-sm font-semibold text-white shadow-lift">
          Rapport sparad
        </div>
      )}

      <Button fullWidth className="mt-4" onClick={() => (showForm ? setShowForm(false) : openNewReport())}>
        {showForm ? "Stäng formulär" : "+ Lägg till dagsrapport"}
      </Button>

      {showForm && (
        <WorkLogForm
          date={selectedDate}
          editId={editingId}
          onSave={() => {
            setShowForm(false);
            setEditingId(null);
            refresh((n) => n + 1);
            setSavedToast(true);
            setTimeout(() => setSavedToast(false), 2000);
          }}
        />
      )}

      <div className="relative mt-4">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Sök förare, fordon eller regnummer…"
          className="input-field pl-10"
        />
      </div>

      <section className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <SectionTitle className="mb-0">Dagens rapporter</SectionTitle>
          <span className="text-xs font-medium text-muted">{logs.length} st</span>
        </div>
        {logs.length === 0 ? (
          <Card className="py-5 text-center">
            <p className="text-sm text-muted">Inga rapporter denna dag.</p>
            <Button size="sm" className="mt-3" onClick={openNewReport}>
              Lägg till dagsrapport
            </Button>
          </Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id} className="mb-2.5">
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
                <p className="mt-1 line-clamp-2 text-sm text-muted">{log.description}</p>
              )}
              <div className="mt-2.5 grid grid-cols-2 gap-2">
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

      <section className="mt-6">
        <SectionTitle>Fordon ({vehicleCount})</SectionTitle>
        {vehicleCount === 0 ? (
          <Card className="py-5 text-center">
            <p className="font-semibold">Fordon saknas</p>
            <p className="mt-1 text-sm text-muted">Återställ standardfordon från Flemströms.</p>
            <Button
              size="sm"
              className="mt-4"
              onClick={() => {
                resetFleetDefaults();
                refresh((n) => n + 1);
              }}
            >
              Återställ standarddata
            </Button>
          </Card>
        ) : (
          <>
            <Card className="divide-y divide-border">
              {visibleVehicles.length === 0 ? (
                <p className="py-3 text-sm text-muted">Inga fordon hittades.</p>
              ) : (
                visibleVehicles.map((v) => (
                  <div key={v.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-medium">{v.name}</p>
                      {v.regNumber && <p className="text-xs text-muted">{v.regNumber}</p>}
                    </div>
                    <span className="text-xs text-muted">{v.type}</span>
                  </div>
                ))
              )}
            </Card>
            {vehicles.length > LIST_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllVehicles(!showAllVehicles)}
                className="mt-2 w-full text-center text-sm font-medium text-primary"
              >
                {showAllVehicles ? "Visa färre" : `Visa alla fordon (${vehicles.length})`}
              </button>
            )}
          </>
        )}
      </section>

      <section className="mt-5">
        <SectionTitle>Personal ({staffCount})</SectionTitle>
        {staffCount === 0 ? (
          <Card className="py-5 text-center">
            <p className="font-semibold">Personal saknas</p>
            <p className="mt-1 text-sm text-muted">Återställ standardpersonal från Flemströms.</p>
            <Button
              size="sm"
              className="mt-4"
              onClick={() => {
                resetFleetDefaults();
                refresh((n) => n + 1);
              }}
            >
              Återställ standarddata
            </Button>
          </Card>
        ) : (
          <>
            <Card className="divide-y divide-border">
              {visibleStaff.length === 0 ? (
                <p className="py-3 text-sm text-muted">Ingen personal hittades.</p>
              ) : (
                visibleStaff.map((s) => (
                  <div key={s.id} className="py-2.5">
                    <p className="text-sm font-medium">{s.name}</p>
                    {s.role && <p className="text-xs text-muted">{s.role}</p>}
                  </div>
                ))
              )}
            </Card>
            {staff.length > LIST_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllStaff(!showAllStaff)}
                className="mt-2 w-full text-center text-sm font-medium text-primary"
              >
                {showAllStaff ? "Visa färre" : `Visa all personal (${staff.length})`}
              </button>
            )}
          </>
        )}
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
      className={`flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium transition active:scale-[0.98] ${
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
    <Card className="mt-4 space-y-4 pb-2">
      <p className="text-lg font-semibold">
        {editId ? "Redigera rapport" : "Ny dagsrapport"}
      </p>
      <div>
        <label className="mb-1 block text-sm font-medium text-muted">Datum</label>
        <input type="date" value={date} disabled className="input-field bg-background text-muted" />
      </div>
      <SearchablePicker
        label="Förare/person"
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
        label="Fordon/resurs"
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
        <label className="mb-1 block text-sm font-medium text-muted">Plats/adress</label>
        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="t.ex. Handelsvägen 9, Luleå"
          className="input-field"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-muted">Antal timmar</label>
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
        <label className="mb-1 block text-sm font-medium text-muted">Vad har gjorts?</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="input-field resize-none"
        />
      </div>
      <ImageUpload imageIds={imageIds} onChange={setImageIds} />
      <Button fullWidth onClick={handleSubmit}>
        {saved ? "Sparat!" : "Spara rapport"}
      </Button>
    </Card>
  );
}
