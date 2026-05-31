"use client";

import { useCalendar } from "@/hooks";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CalendarGrid } from "@/components/appointments/CalendarGrid";
import { DayPanel } from "@/components/appointments/DayPanel";

export default function AppointmentsPage() {
  const {
    currentDate, days, selectedDay,
    setSelectedDay, prevMonth, nextMonth,
    goToToday, appointmentsForSelectedDay,
  } = useCalendar();

  return (
    <>
      <PageHeader title="Appointments" />

      {/* Desktop: side by side filling viewport height */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-4" style={{ height: "calc(100vh - 180px)" }}>
        <div className="lg:col-span-3 min-h-0">
          <CalendarGrid
            currentDate={currentDate}
            days={days}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onToday={goToToday}
          />
        </div>
        <div className="lg:col-span-2 min-h-0">
          <DayPanel
            selectedDay={selectedDay}
            appointments={appointmentsForSelectedDay}
            isLoading={false}
          />
        </div>
      </div>

      {/* Mobile: stacked, natural scroll */}
      <div className="flex flex-col gap-4 lg:hidden">
        <CalendarGrid
          currentDate={currentDate}
          days={days}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onToday={goToToday}
        />
        <DayPanel
          selectedDay={selectedDay}
          appointments={appointmentsForSelectedDay}
          isLoading={false}
        />
      </div>
    </>
  );
}
