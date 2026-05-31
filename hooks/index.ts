"use client";

import { useState, useEffect, useMemo } from "react";
import type {
  KPI,
  RevenueDataPoint,
  ActivityItem,
  Appointment,
  AppointmentStatus,
  Client,
  ClientStatus,
  CalendarDay,
} from "@/types";
import { mockKPIs, mockRevenueWeekly, mockRevenueMonthly, mockActivity } from "@/lib/mock-data/kpis";
import { mockAppointments } from "@/lib/mock-data/agendamentos";
import { mockClients } from "@/lib/mock-data/clientes";
import { sleep } from "@/lib/utils";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
} from "date-fns";

// ─── useKPIs ──────────────────────────────────────────────────────────

interface UseKPIsReturn {
  kpis: KPI[];
  revenueData: RevenueDataPoint[];
  activity: ActivityItem[];
  period: "weekly" | "monthly";
  setPeriod: (p: "weekly" | "monthly") => void;
  isLoading: boolean;
}

export function useKPIs(): UseKPIsReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");

  useEffect(() => {
    sleep(600).then(() => setIsLoading(false));
  }, []);

  const revenueData = period === "weekly" ? mockRevenueWeekly : mockRevenueMonthly;

  return {
    kpis: mockKPIs,
    revenueData,
    activity: mockActivity,
    period,
    setPeriod,
    isLoading,
  };
}

// ─── useAppointments ─────────────────────────────────────────────────

interface UseAppointmentsOptions {
  date?: string;           // filter by ISO date
  status?: AppointmentStatus | "all";
  search?: string;
}

interface UseAppointmentsReturn {
  appointments: Appointment[];
  isLoading: boolean;
  total: number;
}

export function useAppointments(opts: UseAppointmentsOptions = {}): UseAppointmentsReturn {
  const { date, status = "all", search = "" } = opts;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    sleep(400).then(() => setIsLoading(false));
  }, []);

  const appointments = useMemo(() => {
    return mockAppointments.filter((a) => {
      if (date && a.date !== date) return false;
      if (status !== "all" && a.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          a.clientName.toLowerCase().includes(q) ||
          a.service.toLowerCase().includes(q) ||
          a.professional.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [date, status, search]);

  return { appointments, isLoading, total: appointments.length };
}

// ─── useClients ──────────────────────────────────────────────────────

interface UseClientsOptions {
  search?: string;
  status?: ClientStatus | "all";
  page?: number;
  pageSize?: number;
  sortBy?: keyof Client;
  sortDir?: "asc" | "desc";
}

interface UseClientsReturn {
  clients: Client[];
  isLoading: boolean;
  totalPages: number;
  totalCount: number;
}

export function useClients(opts: UseClientsOptions = {}): UseClientsReturn {
  const {
    search = "",
    status = "all",
    page = 1,
    pageSize = 8,
    sortBy = "name",
    sortDir = "asc",
  } = opts;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    sleep(500).then(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...mockClients];

    if (status !== "all") result = result.filter((c) => c.status === status);

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      );
    }

    result.sort((a, b) => {
      const av = a[sortBy] ?? "";
      const bv = b[sortBy] ?? "";
      const cmp = String(av).localeCompare(String(bv), "en-US", { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [search, status, sortBy, sortDir]);

  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const clients = filtered.slice((page - 1) * pageSize, page * pageSize);

  return { clients, isLoading, totalPages, totalCount };
}

// ─── useCalendar ──────────────────────────────────────────────────────

interface UseCalendarReturn {
  currentDate: Date;
  days: CalendarDay[];
  selectedDay: Date | null;
  setSelectedDay: (d: Date | null) => void;
  prevMonth: () => void;
  nextMonth: () => void;
  goToToday: () => void;
  appointmentsForSelectedDay: Appointment[];
}

export function useCalendar(): UseCalendarReturn {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

  const days = useMemo<CalendarDay[]>(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });

    return eachDayOfInterval({ start, end }).map((date) => ({
      date,
      isCurrentMonth: isSameMonth(date, currentDate),
      isToday: isToday(date),
      appointments: mockAppointments.filter((a) =>
        isSameDay(new Date(a.date + "T00:00:00"), date)
      ),
    }));
  }, [currentDate]);

  const appointmentsForSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    return mockAppointments.filter((a) =>
      isSameDay(new Date(a.date + "T00:00:00"), selectedDay)
    );
  }, [selectedDay]);

  return {
    currentDate,
    days,
    selectedDay,
    setSelectedDay,
    prevMonth: () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1)),
    nextMonth: () => setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1)),
    goToToday: () => { setCurrentDate(new Date()); setSelectedDay(new Date()); },
    appointmentsForSelectedDay,
  };
}
