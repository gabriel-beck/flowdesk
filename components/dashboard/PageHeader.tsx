"use client";

import { CalendarPlus } from "lucide-react";
import { useAppointmentModal } from "@/components/providers/AppointmentModalContext";

function getTodayFormatted(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

interface PageHeaderProps {
  title?: string;
}

export function PageHeader({ title = "Dashboard" }: PageHeaderProps) {
  const { openNewAppointment } = useAppointmentModal();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1
          className="text-xl md:text-2xl font-semibold tracking-tight"
          style={{ color: "var(--fd-text-primary)" }}
        >
          {title}
        </h1>
        <p className="text-xs md:text-sm mt-0.5" style={{ color: "var(--fd-text-muted)" }}>
          {getTodayFormatted()}
        </p>
      </div>

      <button
        onClick={openNewAppointment}
        className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-opacity hover:opacity-90 flex-shrink-0 ml-3"
        style={{ background: "var(--fd-accent)", color: "#fff" }}
      >
        <CalendarPlus size={14} />
        <span className="hidden sm:inline">New Appointment</span>
        <span className="sm:hidden">New</span>
      </button>
    </div>
  );
}
