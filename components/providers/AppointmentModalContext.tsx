"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface AppointmentModalContextValue {
  isOpen: boolean;
  openNewAppointment: () => void;
  closeNewAppointment: () => void;
}

const AppointmentModalContext = createContext<AppointmentModalContextValue | null>(null);

export function AppointmentModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openNewAppointment  = useCallback(() => setIsOpen(true),  []);
  const closeNewAppointment = useCallback(() => setIsOpen(false), []);

  return (
    <AppointmentModalContext.Provider value={{ isOpen, openNewAppointment, closeNewAppointment }}>
      {children}
    </AppointmentModalContext.Provider>
  );
}

export function useAppointmentModal() {
  const ctx = useContext(AppointmentModalContext);
  if (!ctx) throw new Error("useAppointmentModal must be used within AppointmentModalProvider");
  return ctx;
}
