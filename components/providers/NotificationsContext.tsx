"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { mockActivity } from "@/lib/mock-data/kpis";
import type { ActivityItem } from "@/types";

interface NotificationsContextValue {
  notifications: ActivityItem[];
  unreadCount: number;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(mockActivity.length);

  const markAllRead = useCallback(() => setUnreadCount(0), []);

  return (
    <NotificationsContext.Provider
      value={{ notifications: mockActivity, unreadCount, markAllRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
