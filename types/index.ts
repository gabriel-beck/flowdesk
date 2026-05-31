// ─── Appointment ─────────────────────────────────────────────────────

export type AppointmentStatus = "confirmed" | "pending" | "cancelled";

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  service: string;
  professional: string;
  date: string; // ISO 8601 — "2025-06-10"
  time: string; // "14:30"
  durationMinutes: number;
  status: AppointmentStatus;
  value: number;
  notes?: string;
}

// ─── Client ──────────────────────────────────────────────────────────

export type ClientStatus = "active" | "inactive" | "vip";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: ClientStatus;
  totalSpent: number;
  totalAppointments: number;
  lastAppointment: string | null; // ISO date
  createdAt: string; // ISO date
  avatarInitials: string;
}

// ─── KPIs / Dashboard ────────────────────────────────────────────────

export interface KPI {
  id: string;
  label: string;
  value: number;
  unit: "currency" | "count" | "percent";
  delta: number;       // variation value
  deltaType: "up" | "down" | "neutral";
  deltaLabel: string;  // e.g. "vs last month"
}

export interface RevenueDataPoint {
  label: string;       // "Mon", "Jan", etc.
  revenue: number;
  appointments: number;
}

// ─── Recent Activity ─────────────────────────────────────────────────

export type ActivityType =
  | "appointment_created"
  | "appointment_cancelled"
  | "client_created"
  | "payment_received";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  time: string;        // "5 min ago", "10:30"
  clientName?: string;
}

// ─── Calendar ────────────────────────────────────────────────────────

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
}
