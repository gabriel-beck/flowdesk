"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu, X, LayoutDashboard, CalendarDays, Users,
  Settings, Zap, LogOut, Sun, Moon, Monitor,
  Bell, CalendarPlus, CalendarX, UserPlus, DollarSign,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useNotifications } from "@/components/providers/NotificationsContext";
import { useDropdown } from "@/hooks/useDropdown";
import type { ActivityType } from "@/types";

const NAV_ITEMS = [
  { href: "/",             label: "Dashboard",    icon: LayoutDashboard },
  { href: "/appointments", label: "Appointments", icon: CalendarDays    },
  { href: "/clients",      label: "Clients",      icon: Users           },
  { href: "/settings",     label: "Settings",     icon: Settings        },
];

const NOTIF_CONFIG: Record<ActivityType, { Icon: React.ElementType; bg: string; color: string }> = {
  appointment_created:   { Icon: CalendarPlus, bg: "var(--fd-success-bg)",   color: "var(--fd-success-text)" },
  appointment_cancelled: { Icon: CalendarX,    bg: "var(--fd-danger-bg)",    color: "var(--fd-danger-text)"  },
  client_created:        { Icon: UserPlus,     bg: "var(--fd-accent-muted)", color: "var(--fd-accent-text)"  },
  payment_received:      { Icon: DollarSign,   bg: "var(--fd-warning-bg)",   color: "var(--fd-warning-text)" },
};

// ─── Notifications bottom sheet ───────────────────────────────────────

function NotificationsSheet({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { notifications, unreadCount, markAllRead } = useNotifications();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.5)" }} onClick={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl flex flex-col"
        style={{
          background: "var(--fd-bg-surface)",
          border: "1px solid var(--fd-border)",
          maxHeight: "80vh",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--fd-border-strong)" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--fd-border)" }}>
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold" style={{ color: "var(--fd-text-primary)" }}>Notifications</p>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium"
                style={{ background: "var(--fd-accent)", color: "#fff" }}>
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={() => { markAllRead(); onClose(); }}
            className="text-xs font-medium" style={{ color: "var(--fd-accent)" }}>
            Mark all as read
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.map((item) => {
            const { Icon, bg, color } = NOTIF_CONFIG[item.type];
            return (
              <div key={item.id} className="flex items-start gap-3 px-5 py-4 border-b last:border-0"
                style={{ borderColor: "var(--fd-border)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: bg }}>
                  <Icon size={15} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug" style={{ color: "var(--fd-text-primary)" }}>
                    {item.description}
                    {item.clientName && <span className="font-medium"> — {item.clientName}</span>}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--fd-text-muted)" }}>{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Safe area padding for iOS */}
        <div className="h-6 flex-shrink-0" />
      </div>
    </>
  );
}

// ─── MobileHeader ─────────────────────────────────────────────────────

export function MobileHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { unreadCount } = useNotifications();

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      {/* Top bar */}
      <div className="md:hidden flex items-center justify-between px-4 h-14 border-b flex-shrink-0"
        style={{ background: "var(--fd-bg-surface)", borderColor: "var(--fd-border)" }}>
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#0fa474" }}>
            <Zap size={14} color="white" />
          </div>
          <span className="text-base font-semibold tracking-tight" style={{ color: "var(--fd-text-primary)" }}>
            flow<span style={{ color: "#0fa474" }}>desk</span>
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Bell */}
          <button
            onClick={() => setNotifsOpen(true)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ color: "var(--fd-text-secondary)" }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "var(--fd-accent)" }} />
            )}
          </button>
          {/* Hamburger */}
          <button onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ color: "var(--fd-text-secondary)" }}>
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Notifications bottom sheet */}
      <NotificationsSheet isOpen={notifsOpen} onClose={() => setNotifsOpen(false)} />

      {/* Drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setDrawerOpen(false)} />
      )}

      {/* Nav drawer */}
      <div
        className="fixed top-0 left-0 h-full z-50 flex flex-col md:hidden transition-transform duration-200"
        style={{
          width: 260,
          background: "var(--fd-bg-sidebar)",
          borderRight: "1px solid var(--fd-border)",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-14 border-b flex-shrink-0"
          style={{ borderColor: "var(--fd-border)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#0fa474" }}>
              <Zap size={14} color="white" />
            </div>
            <span className="text-base font-semibold tracking-tight" style={{ color: "var(--fd-text-primary)" }}>
              flow<span style={{ color: "#0fa474" }}>desk</span>
            </span>
          </div>
          <button onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: "var(--fd-text-muted)" }}>
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium"
                style={active
                  ? { background: "var(--fd-accent-muted)", color: "var(--fd-accent)" }
                  : { color: "var(--fd-text-secondary)" }}>
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t flex flex-col gap-3" style={{ borderColor: "var(--fd-border)" }}>
          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ background: "var(--fd-accent-muted)", color: "var(--fd-accent-text)" }}>SB</div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--fd-text-primary)" }}>Studio Bella</p>
              <p className="text-xs" style={{ color: "var(--fd-text-muted)" }}>Pro Plan</p>
            </div>
          </div>

          {/* Theme toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "var(--fd-text-muted)" }}>Theme</span>
            <div className="flex items-center gap-0.5 rounded-lg p-1"
              style={{ background: "var(--fd-bg-page)", border: "1px solid var(--fd-border)" }}>
              {([
                { value: "light"  as const, icon: Sun,     label: "Light"  },
                { value: "dark"   as const, icon: Moon,    label: "Dark"   },
                { value: "system" as const, icon: Monitor, label: "System" },
              ]).map(({ value, icon: Icon, label }) => (
                <button key={value} onClick={() => setTheme(value)} aria-label={label}
                  className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
                  style={theme === value
                    ? { background: "var(--fd-bg-surface)", color: "var(--fd-accent)", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }
                    : { color: "var(--fd-text-muted)" }}>
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button onClick={() => router.push("/login")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full transition-colors"
            style={{ color: "var(--fd-text-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--fd-danger-bg)";
              (e.currentTarget as HTMLElement).style.color = "var(--fd-danger-text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--fd-text-muted)";
            }}>
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
