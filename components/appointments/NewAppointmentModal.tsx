"use client";

import { useEffect, useState } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { X, CalendarPlus } from "lucide-react";
import { useAppointmentModal } from "@/components/providers/AppointmentModalContext";
import { mockClients } from "@/lib/mock-data/clientes";

const SERVICES = [
  "Hair Hydration Treatment",
  "Hair Coloring",
  "Haircut + Beard Trim",
  "Men's Haircut",
  "Beard Shaping",
  "Deep Facial Cleansing",
  "Chemical Peel",
  "Anti-aging Facial",
  "Eyebrow Design",
  "Relaxing Massage",
  "Sports Massage",
];

const PROFESSIONALS = ["Anna Reed", "Lucas Grant", "Carla Nash"];

// ─── Field components ─────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--fd-text-secondary)" }}>
      {children}
    </label>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
      style={{
        background: "var(--fd-bg-page)",
        border: "1px solid var(--fd-border)",
        color: "var(--fd-text-primary)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--fd-accent)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--fd-border)";
        props.onBlur?.(e);
      }}
    />
  );
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors appearance-none"
      style={{
        background: "var(--fd-bg-page)",
        border: "1px solid var(--fd-border)",
        color: "var(--fd-text-primary)",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "var(--fd-accent)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "var(--fd-border)";
        props.onBlur?.(e);
      }}
    >
      {children}
    </select>
  );
}

// ─── NewAppointmentModal ──────────────────────────────────────────────

export function NewAppointmentModal() {
  const { isOpen, closeNewAppointment } = useAppointmentModal();

  const [form, setForm] = useState({
    clientId:    "",
    service:     "",
    professional:"",
    date:        "",
    time:        "",
    duration:    "60",
    notes:       "",
  });

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeNewAppointment(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeNewAppointment]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reset form on open
  useEffect(() => {
    if (isOpen) setForm({ clientId: "", service: "", professional: "", date: "", time: "", duration: "60", notes: "" });
  }, [isOpen]);

  if (!isOpen) return null;

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  function handleSubmit() {
    console.log("New appointment:", form);
    closeNewAppointment();
  }

  return (
    <ModalShell isOpen={true} onClose={closeNewAppointment} maxWidth="max-w-md">
        <div className="flex flex-col overflow-hidden" style={{ maxHeight: "inherit" }}>
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid var(--fd-border)" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "var(--fd-accent-muted)" }}
              >
                <CalendarPlus size={14} style={{ color: "var(--fd-accent)" }} />
              </div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--fd-text-primary)" }}>
                New Appointment
              </h2>
            </div>
            <button
              onClick={closeNewAppointment}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: "var(--fd-text-muted)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-page)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto min-h-0 px-4 md:px-6 py-4 md:py-5 flex flex-col gap-3 md:gap-4">

            {/* Client */}
            <div>
              <Label>Client</Label>
              <Select value={form.clientId} onChange={set("clientId")}>
                <option value="">Select a client...</option>
                {mockClients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </div>

            {/* Service */}
            <div>
              <Label>Service</Label>
              <Select value={form.service} onChange={set("service")}>
                <option value="">Select a service...</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>

            {/* Professional */}
            <div>
              <Label>Professional</Label>
              <Select value={form.professional} onChange={set("professional")}>
                <option value="">Select a professional...</option>
                {PROFESSIONALS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </Select>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={set("date")} />
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" value={form.time} onChange={set("time")} />
              </div>
            </div>

            {/* Duration */}
            <div>
              <Label>Duration (minutes)</Label>
              <Select value={form.duration} onChange={set("duration")}>
                {["30","45","60","75","90","120"].map((d) => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </Select>
            </div>

            {/* Notes */}
            <div>
              <Label>Notes <span style={{ color: "var(--fd-text-muted)" }}>(optional)</span></Label>
              <textarea
                value={form.notes}
                onChange={set("notes")}
                rows={3}
                placeholder="Any additional information..."
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors resize-none"
                style={{
                  background: "var(--fd-bg-page)",
                  border: "1px solid var(--fd-border)",
                  color: "var(--fd-text-primary)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--fd-accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--fd-border)"; }}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-2 px-4 md:px-6 py-3 md:py-4 flex-shrink-0"
            style={{ borderTop: "1px solid var(--fd-border)" }}
          >
            <button
              onClick={closeNewAppointment}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: "var(--fd-text-secondary)", border: "1px solid var(--fd-border)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-page)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
              style={{ background: "var(--fd-accent)", color: "#fff" }}
            >
              <CalendarPlus size={14} />
              Create Appointment
            </button>
          </div>
        </div>
    </ModalShell>
  );
}
