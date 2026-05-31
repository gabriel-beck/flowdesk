"use client";

import { Sun, Moon, Monitor, Bell, CalendarPlus, CalendarX, UserPlus, DollarSign } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useDropdown } from "@/hooks/useDropdown";
import { useNotifications } from "@/components/providers/NotificationsContext";
import type { ActivityType } from "@/types";

const NOTIF_CONFIG: Record<ActivityType, { Icon: React.ElementType; bg: string; color: string }> = {
  appointment_created:   { Icon: CalendarPlus, bg: "var(--fd-success-bg)",   color: "var(--fd-success-text)" },
  appointment_cancelled: { Icon: CalendarX,    bg: "var(--fd-danger-bg)",    color: "var(--fd-danger-text)"  },
  client_created:        { Icon: UserPlus,     bg: "var(--fd-accent-muted)", color: "var(--fd-accent-text)"  },
  payment_received:      { Icon: DollarSign,   bg: "var(--fd-warning-bg)",   color: "var(--fd-warning-text)" },
};

function NotificationsDropdown({ onMarkAllRead }: { onMarkAllRead: () => void }) {
  const { notifications } = useNotifications();
  return (
    <div className="absolute right-0 top-10 z-50 rounded-xl overflow-hidden shadow-xl"
      style={{ background: "var(--fd-bg-surface)", border: "1px solid var(--fd-border-strong)", width: 320 }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--fd-border)" }}>
        <p className="text-sm font-semibold" style={{ color: "var(--fd-text-primary)" }}>Notifications</p>
        <button onClick={onMarkAllRead} className="text-xs" style={{ color: "var(--fd-accent)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
          Mark all as read
        </button>
      </div>
      {notifications.map((item) => {
        const { Icon, bg, color } = NOTIF_CONFIG[item.type];
        return (
          <div key={item.id} className="flex items-start gap-3 px-4 py-3 cursor-pointer border-b last:border-0"
            style={{ borderColor: "var(--fd-border)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-surface-2)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: bg }}>
              <Icon size={13} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug" style={{ color: "var(--fd-text-primary)" }}>
                {item.description}{item.clientName && <span className="font-medium"> — {item.clientName}</span>}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--fd-text-muted)" }}>{item.time}</p>
            </div>
          </div>
        );
      })}
      <div className="px-4 py-2.5 text-center" style={{ borderTop: "1px solid var(--fd-border)" }}>
        <button className="text-xs" style={{ color: "var(--fd-text-muted)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--fd-text-primary)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--fd-text-muted)"; }}>
          View all notifications
        </button>
      </div>
    </div>
  );
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const { unreadCount, markAllRead } = useNotifications();
  const { isOpen, toggle, close, ref } = useDropdown();

  return (
    <header className="hidden md:flex items-center justify-between px-6 h-16 border-b flex-shrink-0"
      style={{ background: "var(--fd-bg-surface)", borderColor: "var(--fd-border)" }}>
      <div />
      <div className="flex items-center gap-2">
        <div className="relative" ref={ref}>
          <button onClick={toggle}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "var(--fd-text-secondary)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-page)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            aria-label="Notifications">
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "var(--fd-accent)" }} />
            )}
          </button>
          {isOpen && <NotificationsDropdown onMarkAllRead={() => { markAllRead(); close(); }} />}
        </div>
        <div className="flex items-center gap-0.5 rounded-lg p-1"
          style={{ background: "var(--fd-bg-page)", border: "1px solid var(--fd-border)" }}>
          {([
            { value: "light"  as const, icon: Sun,     label: "Light"  },
            { value: "dark"   as const, icon: Moon,    label: "Dark"   },
            { value: "system" as const, icon: Monitor, label: "System" },
          ]).map(({ value, icon: Icon, label }) => (
            <button key={value} onClick={() => setTheme(value)} aria-label={label} title={label}
              className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
              style={theme === value
                ? { background: "var(--fd-bg-surface)", color: "var(--fd-accent)", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }
                : { color: "var(--fd-text-muted)" }}>
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
