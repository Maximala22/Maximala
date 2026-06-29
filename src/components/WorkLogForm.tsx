"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import SearchablePicker from "@/components/SearchablePicker";
import ImageUpload from "@/components/ImageUpload";
import {
  getWorkLogsForDate,
  createWorkLog,
  updateWorkLog,
  searchStaff,
  searchVehicles,
} from "@/lib/fleetStorage";

type WorkLogFormProps = {
  date: string;
  editId?: string | null;
  onSaved?: () => void;
  onToast?: (msg: string) => void;
};

export default function WorkLogForm({ date, editId, onSaved, onToast }: WorkLogFormProps) {
  const router = useRouter();
  const existing = editId
    ? getWorkLogsForDate(date).find((l) => l.id === editId)
    : null;

  const [driverName, setDriverName] = useState(existing?.driverName ?? "");
  const [driverId, setDriverId] = useState(existing?.staffId ?? "");
  const [vehicleName, setVehicleName] = useState(existing?.vehicleName ?? "");
  const [vehicleId, setVehicleId] = useState(existing?.vehicleId ?? "");
  const [hours, setHours] = useState(existing?.hours?.toString() ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [imageIds, setImageIds] = useState<string[]>(existing?.imageIds ?? []);

  const canSave = driverName.trim().length > 0 && vehicleName.trim().length > 0;

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
    if (!canSave) return;
    const data = {
      date,
      driverName: driverName.trim(),
      staffId: driverId || undefined,
      vehicleName: vehicleName.trim(),
      vehicleId: vehicleId || undefined,
      hours: hours ? parseFloat(hours.replace(",", ".")) : undefined,
      description: description.trim() || undefined,
      imageIds,
    };
    if (editId) updateWorkLog(editId, data);
    else createWorkLog(data);
    onToast?.("Rapport sparad");
    onSaved?.();
    router.push(`/dagsrapport?date=${date}&saved=1`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label-upper mb-1.5 block">Datum</label>
        <input
          type="date"
          value={date}
          disabled
          className="input-field bg-background text-muted"
        />
      </div>

      <SearchablePicker
        label="Förare"
        icon="person"
        placeholder="Välj förare…"
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
        label="Fordon"
        icon="vehicle"
        placeholder="Välj fordon…"
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
        <label className="label-upper mb-1.5 block">Timmar</label>
        <div className="flex items-center overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <input
            type="text"
            inputMode="decimal"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="7.5"
            className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-base font-semibold outline-none"
          />
          <span className="border-l border-border bg-background px-4 py-3 font-semibold text-muted">
            h
          </span>
        </div>
      </div>

      <div>
        <label className="label-upper mb-1.5 block">Vad har gjorts?</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Beskriv arbetet kort…"
          className="input-field resize-none"
        />
      </div>

      <div>
        <label className="label-upper mb-1.5 block">Bild</label>
        <ImageUpload
          imageIds={imageIds}
          onChange={setImageIds}
          context="rapporten"
          onToast={onToast}
        />
      </div>

      <Button fullWidth size="lg" onClick={handleSubmit} disabled={!canSave}>
        {canSave ? "Spara rapport" : "Välj förare och fordon"}
      </Button>
      {!canSave && (
        <p className="text-center text-xs text-muted">
          Välj förare och fordon för att spara rapport.
        </p>
      )}
    </div>
  );
}
