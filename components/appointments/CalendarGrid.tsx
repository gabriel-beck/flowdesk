"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import type { CalendarDay, AppointmentStatus } from "@/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const GRID_CELLS = 42;

const STATUS_DOT: Record<AppointmentStatus, string> = {
  confirmed: "#0fa474",
  pending:   "#f59e0b",
  cancelled: "#ef4444",
};

// ─── Skeleton ────────────────────────────────────────────────────────

export function CalendarGridSkeleton() {
  return (
    <div className="rounded-xl flex flex-col h-full overflow-hidden"
      style={{ background: "var(--fd-bg-surface)", border: "1px solid var(--fd-border)" }}>
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
        <div className="h-5 w-36 rounded animate-pulse" style={{ background: "var(--fd-border-strong)" }} />
        <div className="flex items-center gap-2">
          <div className="h-7 w-16 rounded-lg animate-pulse" style={{ background: "var(--fd-border-strong)" }} />
          <div className="h-7 w-7 rounded-lg animate-pulse" style={{ background: "var(--fd-border-strong)" }} />
          <div className="h-7 w-7 rounded-lg animate-pulse" style={{ background: "var(--fd-border-strong)" }} />
        </div>
      </div>
      <div className="grid grid-cols-7 flex-shrink-0" style={{ borderTop: "1px solid var(--fd-border)", borderBottom: "1px solid var(--fd-border)" }}>
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2 flex justify-center">
            <div className="h-3 w-6 rounded animate-pulse" style={{ background: "var(--fd-border-strong)" }} />
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, row) => (
          <div key={row} className="grid grid-cols-7 flex-1"
            style={{ borderBottom: row < 5 ? "1px solid var(--fd-border)" : "none" }}>
            {Array.from({ length: 7 }).map((_, col) => (
              <div key={col} className="flex flex-col items-center justify-center gap-2">
                <div className="h-7 w-7 rounded-full animate-pulse"
                  style={{ background: "var(--fd-border-strong)", opacity: (row + col) % 3 === 0 ? 0.3 : 0.6 }} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 px-5 py-3 flex-shrink-0"
        style={{ borderTop: "1px solid var(--fd-border)" }}>
        {["confirmed", "pending", "cancelled"].map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--fd-border-strong)" }} />
            <div className="h-3 w-14 rounded animate-pulse" style={{ background: "var(--fd-border-strong)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Nav button ──────────────────────────────────────────────────────

function NavButton({ onClick, children, label }: {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button onClick={onClick} aria-label={label}
      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
      style={{ color: "var(--fd-text-secondary)", border: "1px solid var(--fd-border)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-page)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
      {children}
    </button>
  );
}

// ─── Day cell ────────────────────────────────────────────────────────

function DayCell({ day, isSelected, onClick }: {
  day: CalendarDay;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { date, isCurrentMonth, isToday, appointments } = day;
  const statuses = [...new Set(appointments.map((a) => a.status))].slice(0, 3);

  return (
    <div className="flex flex-col items-center justify-center gap-1.5">
      <button onClick={onClick}
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all select-none"
        style={
          isSelected
            ? { background: "var(--fd-accent)", color: "#fff" }
            : isToday
            ? { color: "var(--fd-accent)", boxShadow: "0 0 0 1.5px var(--fd-accent)" }
            : { color: isCurrentMonth ? "var(--fd-text-primary)" : "var(--fd-text-muted)" }
        }
        onMouseEnter={(e) => {
          if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--fd-border)";
        }}
        onMouseLeave={(e) => {
          if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
        }}>
        {date.getDate()}
      </button>
      <div className="flex items-center gap-0.5" style={{ height: 6 }}>
        {statuses.map((status) => (
          <span key={status} className="w-1.5 h-1.5 rounded-full"
            style={{ background: STATUS_DOT[status] }} />
        ))}
      </div>
    </div>
  );
}

// ─── CalendarGrid ─────────────────────────────────────────────────────

interface CalendarGridProps {
  currentDate: Date;
  days: CalendarDay[];
  selectedDay: Date | null;
  onSelectDay: (d: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarGrid({
  currentDate, days, selectedDay,
  onSelectDay, onPrevMonth, onNextMonth, onToday,
}: CalendarGridProps) {
  const cells = [...days];
  while (cells.length < GRID_CELLS) cells.push(null as unknown as CalendarDay);
  const rows = Array.from({ length: 6 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  return (
    <div className="rounded-xl overflow-hidden flex flex-col h-full"
      style={{ background: "var(--fd-bg-surface)", border: "1px solid var(--fd-border)" }}>

      {/* Nav — fixed */}
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
        <h2 className="text-base font-semibold" style={{ color: "var(--fd-text-primary)" }}>
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-1.5">
          <button onClick={onToday}
            className="px-2.5 h-7 rounded-lg text-xs font-medium transition-colors"
            style={{ color: "var(--fd-text-secondary)", border: "1px solid var(--fd-border)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-page)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            Today
          </button>
          <NavButton onClick={onPrevMonth} label="Previous month"><ChevronLeft size={14} /></NavButton>
          <NavButton onClick={onNextMonth} label="Next month"><ChevronRight size={14} /></NavButton>
        </div>
      </div>

      {/* Weekday headers — fixed */}
      <div className="grid grid-cols-7 flex-shrink-0"
        style={{ borderTop: "1px solid var(--fd-border)", borderBottom: "1px solid var(--fd-border)" }}>
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-2 text-center">
            <span className="text-xs font-medium" style={{ color: "var(--fd-text-muted)" }}>{d}</span>
          </div>
        ))}
      </div>

      {/* Week rows — flex-1 so rows fill all remaining height evenly */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {rows.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 flex-1"
            style={{ borderBottom: wi < 5 ? "1px solid var(--fd-border)" : "none" }}>
            {week.map((day, di) =>
              day ? (
                <DayCell
                  key={day.date.toISOString()}
                  day={day}
                  isSelected={selectedDay !== null && day.date.toDateString() === selectedDay.toDateString()}
                  onClick={() => onSelectDay(day.date)}
                />
              ) : (
                <div key={`empty-${wi}-${di}`} />
              )
            )}
          </div>
        ))}
      </div>

      {/* Legend — fixed */}
      <div className="flex items-center gap-4 px-5 py-3 flex-shrink-0"
        style={{ borderTop: "1px solid var(--fd-border)" }}>
        {(["confirmed", "pending", "cancelled"] as AppointmentStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: STATUS_DOT[s] }} />
            <span className="text-xs capitalize" style={{ color: "var(--fd-text-muted)" }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
