"use client";

import { Calendar, MoreHorizontal, Pencil, CalendarClock, X } from "lucide-react";
import { format } from "date-fns";
import type { Appointment, AppointmentStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useDropdown } from "@/hooks/useDropdown";

// ─── Status config ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; bar: string; bg: string; text: string }
> = {
  confirmed: { label: "Confirmed", bar: "#0fa474", bg: "var(--fd-success-bg)", text: "var(--fd-success-text)" },
  pending:   { label: "Pending",   bar: "#f59e0b", bg: "var(--fd-warning-bg)", text: "var(--fd-warning-text)" },
  cancelled: { label: "Cancelled", bar: "#ef4444", bg: "var(--fd-danger-bg)",  text: "var(--fd-danger-text)"  },
};

const CARD_ACTIONS = [
  { icon: Pencil,        label: "Edit",       color: "var(--fd-text-primary)" },
  { icon: CalendarClock, label: "Reschedule", color: "var(--fd-text-primary)" },
  { icon: X,             label: "Cancel",     color: "var(--fd-danger-text)"  },
];

// ─── Skeleton ─────────────────────────────────────────────────────────

function Sk({ className }: { className?: string }) {
  return <div className={`rounded animate-pulse ${className}`} style={{ background: "var(--fd-border-strong)" }} />;
}

export function DayPanelSkeleton() {
  return (
    <div className="rounded-xl flex flex-col h-full"
      style={{ background: "var(--fd-bg-surface)", border: "1px solid var(--fd-border)" }}>
      <div className="px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--fd-border)" }}>
        <Sk className="h-4 w-32 mb-1.5" />
        <Sk className="h-3 w-20" />
      </div>
      <div className="flex flex-col gap-3 p-4 overflow-y-auto flex-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden flex flex-shrink-0"
            style={{ border: "1px solid var(--fd-border)" }}>
            <div className="w-1 flex-shrink-0 animate-pulse" style={{ background: "var(--fd-border-strong)" }} />
            <div className="flex flex-col gap-2 p-3 flex-1">
              <div className="flex items-center justify-between">
                <Sk className="h-3 w-12" />
                <Sk className="h-5 w-20 rounded-full" />
              </div>
              <Sk className="h-3.5 w-40" />
              <Sk className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────

function EmptyState({ date }: { date: Date }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-6 text-center py-12">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: "var(--fd-bg-page)" }}>
        <Calendar size={18} style={{ color: "var(--fd-text-muted)" }} />
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--fd-text-secondary)" }}>
          No appointments
        </p>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--fd-text-muted)" }}>
          Nothing scheduled for {format(date, "MMM d")}. Select another day or create a new appointment.
        </p>
      </div>
    </div>
  );
}

// ─── AppointmentCard ──────────────────────────────────────────────────

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const { isOpen, toggle, close, ref } = useDropdown();
  const config = STATUS_CONFIG[appointment.status];

  return (
    <div
      className="rounded-lg flex flex-shrink-0 transition-shadow hover:shadow-sm"
      style={{ border: "1px solid var(--fd-border)" }}
    >
      {/* Color bar */}
      <div className="w-1 flex-shrink-0 rounded-l-lg" style={{ background: config.bar }} />

      {/* Content */}
      <div className="flex flex-col gap-2 p-3 flex-1 min-w-0">
        {/* Time + badge + menu */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-xs font-semibold tabular-nums"
            style={{ color: "var(--fd-text-primary)", fontFamily: "var(--font-mono)" }}
          >
            {appointment.time}
          </span>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: config.bg, color: config.text }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: config.bar }} />
              {config.label}
            </span>

            {/* Three dots — useDropdown handles outside click + Escape */}
            <div className="relative" ref={ref}>
              <button
                onClick={(e) => { e.stopPropagation(); toggle(); }}
                className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                style={{ color: "var(--fd-text-muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-border)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <MoreHorizontal size={13} />
              </button>

              {isOpen && (
                <div
                  className="absolute right-0 top-8 z-50 rounded-lg overflow-hidden shadow-xl"
                  style={{
                    background: "var(--fd-bg-surface-2)",
                    border: "1px solid var(--fd-border-strong)",
                    minWidth: 160,
                  }}
                >
                  {CARD_ACTIONS.map(({ icon: Icon, label, color }) => (
                    <button
                      key={label}
                      onClick={() => { console.log(`${label}: ${appointment.id}`); close(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors text-left"
                      style={{ color }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-border)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Service */}
        <p className="text-sm font-medium truncate" style={{ color: "var(--fd-text-primary)" }}>
          {appointment.service}
        </p>

        {/* Meta */}
        <p className="text-xs truncate" style={{ color: "var(--fd-text-muted)" }}>
          {appointment.professional}
          <span className="mx-1.5" style={{ color: "var(--fd-border-strong)" }}>·</span>
          {appointment.durationMinutes} min
          <span className="mx-1.5" style={{ color: "var(--fd-border-strong)" }}>·</span>
          {formatCurrency(appointment.value)}
        </p>
      </div>
    </div>
  );
}

// ─── DayPanel ─────────────────────────────────────────────────────────

interface DayPanelProps {
  selectedDay: Date | null;
  appointments: Appointment[];
  isLoading: boolean;
}

export function DayPanel({ selectedDay, appointments, isLoading }: DayPanelProps) {
  if (isLoading) return <DayPanelSkeleton />;
  if (!selectedDay) return null;

  const sorted = [...appointments].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="rounded-xl flex flex-col h-full"
      style={{ background: "var(--fd-bg-surface)", border: "1px solid var(--fd-border)" }}>

      {/* Header — fixed */}
      <div className="px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--fd-border)" }}>
        <p className="text-sm font-semibold" style={{ color: "var(--fd-text-primary)" }}>
          {format(selectedDay, "EEEE, MMMM d")}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--fd-text-muted)" }}>
          {sorted.length === 0 ? "No appointments" : `${sorted.length} appointment${sorted.length > 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Cards — scrollable, never shrink */}
      {sorted.length === 0 ? (
        <EmptyState date={selectedDay} />
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0 p-4 flex flex-col gap-2.5">
          {sorted.map((a) => (
            <AppointmentCard key={a.id} appointment={a} />
          ))}
        </div>
      )}
    </div>
  );
}
