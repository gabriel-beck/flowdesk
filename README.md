<div align="center">
  <h1>Flowdesk</h1>
  <p>Appointment management SaaS dashboard built with Next.js 15, TypeScript, and Tailwind CSS v4</p>

  ![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)
  ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
  ![Recharts](https://img.shields.io/badge/Recharts-22C55E?style=flat-square)
</div>

---

## Overview

Flowdesk is a SaaS dashboard for service-based businesses like beauty clinics, pilates studios, barbershops, and consultancies. It brings together client management, appointment scheduling, revenue tracking, and team operations in one interface.

Built as a portfolio project to show production-level frontend architecture, UI quality, and full-stack thinking.

## Features

**Dashboard**
- KPI cards with delta indicators and shimmer skeleton loaders
- Revenue chart (Recharts) with weekly/monthly toggle
- Today's appointments panel with status badges
- Recent activity feed

**Appointments**
- Monthly calendar with status dots per day
- Day panel with appointment details and actions (Edit, Reschedule, Cancel)
- New appointment modal with full form

**Clients**
- Sortable, filterable, paginated table
- VIP status with distinct visual treatment
- Client detail modal with appointment history
- Inline edit mode inside the modal, no second dialog needed

**Settings**
- Business profile form
- Notification preferences with animated toggles
- Current plan display

**UX Details**
- Dark mode by default, light and system options via header toggle
- Fully responsive: sidebar collapses on desktop, drawer navigation on mobile
- Bottom sheet modals on mobile, centered modals on desktop
- Shared `useDropdown`, `useClientModal`, and `useAppointmentModal` hooks
- Anti-FOUC script prevents theme flash on load
- All data mocked with relative dates so the calendar always shows appointments

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Charts | Recharts |
| Icons | Lucide React |
| Date utilities | date-fns |
| Deploy | Vercel |

## Architecture Highlights

**Tailwind v4 CSS-first setup.** No `tailwind.config.js`. Brand tokens live in `@theme {}`, semantic tokens (`--fd-*`) in CSS variables that switch between light and dark. Theme change is a single class toggle on `<html>`.

**Dual-layer token system**
```
@theme { --color-jade-400: #0fa474 }   // static brand tokens, become Tailwind classes
:root  { --fd-accent: #0fa474 }        // semantic tokens, referenced in components
.dark  { --fd-accent: #0fa474 }        // same value in dark (accent stays consistent)
```

**Shared modal infrastructure.** `ModalShell` renders as a centered dialog on desktop and a bottom sheet on mobile. Both `NewAppointmentModal` and `ClientModal` use it.

**Context-based state.** `AppointmentModalContext` and `NotificationsContext` let any component in the dashboard open the appointment modal or read notification state without prop drilling.

## Project Structure

```
app/
  (auth)/login/           # Login page
  (dashboard)/
    layout.tsx            # Sidebar + header + providers
    page.tsx              # Dashboard home
    appointments/         # Calendar + day panel
    clients/              # Table + modal
    settings/             # Profile + preferences

components/
  layout/                 # Sidebar, Header, MobileNav
  providers/              # ThemeProvider, AppointmentModalContext, NotificationsContext
  ui/                     # ModalShell (shared modal wrapper)
  dashboard/              # KPICard, RevenueChart, TodayList, ActivityFeed
  appointments/           # CalendarGrid, DayPanel, NewAppointmentModal
  clients/                # ClientsTable, ClientFilters, ClientModal

hooks/
  useDropdown.ts          # Outside click + Escape key handler
  useClientModal.ts       # Selected client + open/close state
  useCalendar.ts          # Month navigation + day selection
  index.ts                # useKPIs, useAppointments, useClients

lib/
  mock-data/              # Relative-date appointments, clients, KPIs
  utils.ts                # cn(), formatCurrency(), formatDate()

types/index.ts            # Appointment, Client, KPI, ActivityItem
```

## Getting Started

```bash
git clone https://github.com/gbavn/flowdesk.git
cd flowdesk
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The login page redirects to the dashboard directly, no auth required.

## Design Decisions

**Dark mode as default.** Service business dashboards get used in all kinds of lighting conditions. Dark mode is easier on the eyes during long sessions and looks better in screenshots.

**Mock data with relative dates.** Hardcoded dates go stale. All appointment dates are calculated at runtime relative to today, so the calendar always has visible data no matter when the project is opened.

**No UI component library.** Using shadcn/ui or similar would hide the styling decisions. Every component is built from scratch with Tailwind and CSS variables to show full control over the visual output.
