import type { KPI, RevenueDataPoint, ActivityItem } from "@/types";

export const mockKPIs: KPI[] = [
  {
    id: "revenue",
    label: "Monthly Revenue",
    value: 12840,
    unit: "currency",
    delta: 18.2,
    deltaType: "up",
    deltaLabel: "vs last month",
  },
  {
    id: "appointments_today",
    label: "Appointments Today",
    value: 24,
    unit: "count",
    delta: 3,
    deltaType: "up",
    deltaLabel: "vs yesterday",
  },
  {
    id: "new_clients",
    label: "New Clients",
    value: 14,
    unit: "count",
    delta: 7.7,
    deltaType: "up",
    deltaLabel: "vs last month",
  },
  {
    id: "cancellation_rate",
    label: "Cancellation Rate",
    value: 8.3,
    unit: "percent",
    delta: 1.2,
    deltaType: "up", // up is bad here — component handles the semantic
    deltaLabel: "vs last month",
  },
];

export const mockRevenueWeekly: RevenueDataPoint[] = [
  { label: "Mon", revenue: 1820, appointments: 12 },
  { label: "Tue", revenue: 2340, appointments: 15 },
  { label: "Wed", revenue: 1650, appointments: 10 },
  { label: "Thu", revenue: 2890, appointments: 18 },
  { label: "Fri", revenue: 3120, appointments: 21 },
  { label: "Sat", revenue: 2640, appointments: 17 },
  { label: "Sun", revenue: 380, appointments: 3 },
];

export const mockRevenueMonthly: RevenueDataPoint[] = [
  { label: "Jan", revenue: 9200, appointments: 68 },
  { label: "Feb", revenue: 8750, appointments: 62 },
  { label: "Mar", revenue: 10400, appointments: 74 },
  { label: "Apr", revenue: 11200, appointments: 80 },
  { label: "May", revenue: 10870, appointments: 77 },
  { label: "Jun", revenue: 12840, appointments: 96 },
];

export const mockActivity: ActivityItem[] = [
  {
    id: "act1",
    type: "appointment_created",
    description: "New appointment scheduled",
    clientName: "Camille Norton",
    time: "5 min ago",
  },
  {
    id: "act2",
    type: "payment_received",
    description: "Payment received — $180",
    clientName: "Marina Foster",
    time: "23 min ago",
  },
  {
    id: "act3",
    type: "appointment_cancelled",
    description: "Appointment cancelled",
    clientName: "Fiona Lane",
    time: "1h ago",
  },
  {
    id: "act4",
    type: "client_created",
    description: "New client registered",
    clientName: "Diego Marsh",
    time: "2h ago",
  },
  {
    id: "act5",
    type: "payment_received",
    description: "Payment received — $95",
    clientName: "Rafael Stone",
    time: "3h ago",
  },
];
