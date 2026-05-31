import type { Appointment, AppointmentStatus } from "@/types";
import { CalendarX } from "lucide-react";

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`rounded animate-pulse ${className}`} style={{ background: "var(--fd-border-strong)" }} />
  );
}

export function TodayListSkeleton() {
  return (
    <div
      className="rounded-xl p-5 flex flex-col h-full"
      style={{ background: "var(--fd-bg-surface)", border: "1px solid var(--fd-border)" }}
    >
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex flex-col gap-3 flex-1 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-2.5 w-36" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

const STATUS_MAP: Record<AppointmentStatus, { label: string; bg: string; text: string }> = {
  confirmed: { label: "Confirmed", bg: "var(--fd-success-bg)", text: "var(--fd-success-text)" },
  pending:   { label: "Pending",   bg: "var(--fd-warning-bg)", text: "var(--fd-warning-text)" },
  cancelled: { label: "Cancelled", bg: "var(--fd-danger-bg)",  text: "var(--fd-danger-text)"  },
};

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const s = STATUS_MAP[status];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
      style={{ background: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.text }} />
      {s.label}
    </span>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
      style={{ background: "var(--fd-accent-muted)", color: "var(--fd-accent-text)" }}>
      {initials}
    </div>
  );
}

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  const initials = appointment.clientName.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: "var(--fd-border)" }}>
      <div className="flex items-center gap-3 min-w-0">
        <Avatar initials={initials} />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "var(--fd-text-primary)" }}>
            {appointment.clientName}
          </p>
          <p className="text-xs truncate" style={{ color: "var(--fd-text-muted)" }}>
            {appointment.service} · {appointment.time}
          </p>
        </div>
      </div>
      <StatusBadge status={appointment.status} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2">
      <CalendarX size={28} style={{ color: "var(--fd-text-muted)" }} />
      <p className="text-sm" style={{ color: "var(--fd-text-muted)" }}>No appointments today</p>
    </div>
  );
}

interface TodayListProps {
  appointments: Appointment[];
  isLoading: boolean;
}

export function TodayList({ appointments, isLoading }: TodayListProps) {
  if (isLoading) return <TodayListSkeleton />;

  return (
    <div className="rounded-xl p-5 flex flex-col h-full"
      style={{ background: "var(--fd-bg-surface)", border: "1px solid var(--fd-border)" }}>

      {/* Header — fixed */}
      <div className="flex items-center justify-between mb-1 flex-shrink-0">
        <p className="text-sm font-medium" style={{ color: "var(--fd-text-primary)" }}>
          Today&apos;s Appointments
        </p>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: "var(--fd-accent-muted)", color: "var(--fd-accent-text)" }}>
          {appointments.length}
        </span>
      </div>

      {/* List — scrollable */}
      {appointments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0">
          {appointments.map((a) => <AppointmentRow key={a.id} appointment={a} />)}
        </div>
      )}
    </div>
  );
}
