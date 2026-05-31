"use client";

import { useEffect, useState } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { X, CalendarPlus, Pencil, ArrowLeft, Save, CalendarDays, DollarSign, Clock, Phone, Mail } from "lucide-react";
import type { Client, ClientStatus, AppointmentStatus } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { mockAppointments } from "@/lib/mock-data/agendamentos";
import { useAppointmentModal } from "@/components/providers/AppointmentModalContext";

// ─── Types ────────────────────────────────────────────────────────────

type ModalMode = "view" | "edit";

// ─── Status configs ───────────────────────────────────────────────────

const CLIENT_STATUS: Record<ClientStatus, { label: string; bg: string; text: string }> = {
  active:   { label: "Active",   bg: "var(--fd-success-bg)",  text: "var(--fd-success-text)" },
  vip:      { label: "VIP",      bg: "var(--fd-vip-bg)",      text: "var(--fd-vip-text)"     },
  inactive: { label: "Inactive", bg: "var(--fd-bg-page)",     text: "var(--fd-text-muted)"   },
};

const APPT_STATUS: Record<AppointmentStatus, { label: string; bar: string; bg: string; text: string }> = {
  confirmed: { label: "Confirmed", bar: "#0fa474", bg: "var(--fd-success-bg)", text: "var(--fd-success-text)" },
  pending:   { label: "Pending",   bar: "#f59e0b", bg: "var(--fd-warning-bg)", text: "var(--fd-warning-text)" },
  cancelled: { label: "Cancelled", bar: "#ef4444", bg: "var(--fd-danger-bg)",  text: "var(--fd-danger-text)"  },
};

// ─── Shared sub-components ────────────────────────────────────────────

function Avatar({ client }: { client: Client }) {
  const isVip = client.status === "vip";
  return (
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-semibold flex-shrink-0"
      style={{
        background: isVip ? "var(--fd-vip-bg)"    : "var(--fd-bg-page)",
        color:      isVip ? "var(--fd-vip-text)"   : "var(--fd-text-secondary)",
        border:     isVip ? "2px solid var(--fd-vip-border)" : "1px solid var(--fd-border)",
      }}
    >
      {client.avatarInitials}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: {
  icon: React.ElementType; label: string; value: string;
}) {
  return (
    <div
      className="flex md:flex-col items-center md:items-start justify-between md:justify-start gap-2 md:gap-2 px-4 py-3 md:p-4 rounded-xl md:flex-1"
      style={{ background: "var(--fd-bg-page)", border: "1px solid var(--fd-border)" }}
    >
      <div className="flex items-center gap-1.5">
        <Icon size={13} style={{ color: "var(--fd-text-muted)" }} />
        <span className="text-xs" style={{ color: "var(--fd-text-muted)" }}>{label}</span>
      </div>
      <p className="text-base md:text-xl font-semibold tracking-tight"
        style={{ color: "var(--fd-text-primary)", fontFamily: "var(--font-mono)" }}>
        {value}
      </p>
    </div>
  );
}

function EditInput({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--fd-text-secondary)" }}>
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
        style={{ background: "var(--fd-bg-page)", border: "1px solid var(--fd-border)", color: "var(--fd-text-primary)" }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--fd-accent)"; props.onFocus?.(e); }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--fd-border)";  props.onBlur?.(e);  }}
      />
    </div>
  );
}

// ─── View mode ────────────────────────────────────────────────────────

function ViewBody({ client }: { client: Client }) {
  const history = mockAppointments
    .filter((a) => a.clientId === client.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6 flex flex-col gap-4 md:gap-6">
      {/* Mobile: vertical list. Desktop: horizontal cards */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-3">
        <StatCard icon={DollarSign}    label="Total Spent"    value={formatCurrency(client.totalSpent)} />
        <StatCard icon={CalendarDays}  label="Appointments"   value={String(client.totalAppointments)} />
        <StatCard icon={Clock}         label="Client Since"   value={new Date(client.createdAt).getFullYear().toString()} />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-widest mb-3"
          style={{ color: "var(--fd-text-muted)" }}>
          Appointment History
        </p>
        {history.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--fd-text-muted)" }}>No appointments yet.</p>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--fd-border)" }}>
            <div className="px-4" style={{ background: "var(--fd-bg-surface)" }}>
              {history.map((a) => {
                const s = APPT_STATUS[a.status];
                return (
                  <div key={a.id} className="flex items-center justify-between py-3 border-b last:border-0"
                    style={{ borderColor: "var(--fd-border)" }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: s.bar }} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--fd-text-primary)" }}>
                          {a.service}
                        </p>
                        <p className="text-xs truncate" style={{ color: "var(--fd-text-muted)" }}>
                          {formatDate(a.date)} · {a.professional}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0 ml-3">
                      <span className="text-xs font-medium tabular-nums"
                        style={{ color: "var(--fd-text-secondary)", fontFamily: "var(--font-mono)" }}>
                        {formatCurrency(a.value)}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: s.bg, color: s.text }}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Edit mode ────────────────────────────────────────────────────────

interface EditForm {
  name:   string;
  email:  string;
  phone:  string;
  status: ClientStatus;
  notes:  string;
}

function EditBody({ form, onChange }: {
  form: EditForm;
  onChange: (f: EditForm) => void;
}) {
  function set(key: keyof EditForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange({ ...form, [key]: e.target.value });
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-4 md:p-6 flex flex-col gap-3 md:gap-4">
      <EditInput label="Full Name"    value={form.name}  onChange={set("name")}  />
      <EditInput label="Email"        value={form.email} onChange={set("email")} type="email" />
      <EditInput label="Phone"        value={form.phone} onChange={set("phone")} type="tel" />

      {/* Status */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--fd-text-secondary)" }}>
          Status
        </label>
        <select
          value={form.status}
          onChange={set("status")}
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none appearance-none"
          style={{ background: "var(--fd-bg-page)", border: "1px solid var(--fd-border)", color: "var(--fd-text-primary)" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--fd-accent)"; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--fd-border)";  }}
        >
          <option value="active">Active</option>
          <option value="vip">VIP</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--fd-text-secondary)" }}>
          Notes <span style={{ color: "var(--fd-text-muted)" }}>(optional)</span>
        </label>
        <textarea
          value={form.notes}
          onChange={set("notes")}
          rows={4}
          placeholder="Internal notes about this client..."
          className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none transition-colors"
          style={{ background: "var(--fd-bg-page)", border: "1px solid var(--fd-border)", color: "var(--fd-text-primary)" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--fd-accent)"; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--fd-border)";  }}
        />
      </div>
    </div>
  );
}

// ─── ClientModal ──────────────────────────────────────────────────────

interface ClientModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientModal({ client, isOpen, onClose }: ClientModalProps) {
  const { openNewAppointment } = useAppointmentModal();
  const [mode, setMode] = useState<ModalMode>("view");
  const [editForm, setEditForm] = useState<EditForm>({ name: "", email: "", phone: "", status: "active", notes: "" });

  // Reset to view mode and populate form when client changes
  useEffect(() => {
    if (client) {
      setMode("view");
      setEditForm({ name: client.name, email: client.email, phone: client.phone, status: client.status, notes: "" });
    }
  }, [client]);

  // Close on Escape — edit mode goes back to view, view mode closes
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mode === "edit") setMode("view");
        else onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, mode, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !client) return null;

  const status = CLIENT_STATUS[client.status];
  const isEdit = mode === "edit";

  function handleSave() {
    console.log("Saved client:", editForm);
    setMode("view");
  }

  return (
    <ModalShell isOpen={true} onClose={() => isEdit ? setMode("view") : onClose()}>
      <div className="flex flex-col overflow-hidden" style={{ maxHeight: "inherit" }}>
          {/* Header */}
          <div className="flex items-start justify-between px-5 py-4 flex-shrink-0"
            style={{ borderBottom: "1px solid var(--fd-border)" }}>
            <div className="flex items-center gap-3 min-w-0">
              {/* Smaller avatar on mobile */}
              <div
                className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-base md:text-xl font-semibold flex-shrink-0"
                style={{
                  background: client.status === "vip" ? "var(--fd-vip-bg)"    : "var(--fd-bg-page)",
                  color:      client.status === "vip" ? "var(--fd-vip-text)"   : "var(--fd-text-secondary)",
                  border:     client.status === "vip" ? "2px solid var(--fd-vip-border)" : "1px solid var(--fd-border)",
                }}
              >
                {client.avatarInitials}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-base md:text-lg font-semibold" style={{ color: "var(--fd-text-primary)" }}>
                    {isEdit ? editForm.name || client.name : client.name}
                  </h2>
                  {!isEdit && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                      style={{ background: status.bg, color: status.text }}>
                      {status.label}
                    </span>
                  )}
                  {isEdit && (
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: "var(--fd-warning-bg)", color: "var(--fd-warning-text)" }}>
                      Editing
                    </span>
                  )}
                </div>
                {!isEdit && (
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-xs truncate" style={{ color: "var(--fd-text-muted)" }}>
                      <Mail size={11} className="flex-shrink-0" />{client.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--fd-text-muted)" }}>
                      <Phone size={11} className="flex-shrink-0" />{client.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button onClick={() => isEdit ? setMode("view") : onClose()}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ml-2 transition-colors"
              style={{ color: "var(--fd-text-muted)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-page)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              <X size={16} />
            </button>
          </div>

          {/* Body — switches between view and edit */}
          {isEdit
            ? <EditBody form={editForm} onChange={setEditForm} />
            : <ViewBody client={client} />
          }

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-4 md:px-6 py-3 md:py-4 flex-shrink-0"
            style={{ borderTop: "1px solid var(--fd-border)" }}>
            {isEdit ? (
              <>
                <button onClick={() => setMode("view")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: "var(--fd-text-secondary)", border: "1px solid var(--fd-border)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-page)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <ArrowLeft size={14} />
                  Cancel
                </button>
                <button onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ background: "var(--fd-accent)", color: "#fff" }}>
                  <Save size={14} />
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setMode("edit")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: "var(--fd-text-secondary)", border: "1px solid var(--fd-border)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-page)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <Pencil size={14} />
                  Edit Client
                </button>
                <button
                  onClick={() => { onClose(); openNewAppointment(); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                  style={{ background: "var(--fd-accent)", color: "#fff" }}>
                  <CalendarPlus size={14} />
                  New Appointment
                </button>
              </>
            )}
          </div>
      </div>
    </ModalShell>
  );
}
