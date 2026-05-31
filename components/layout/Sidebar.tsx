"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/",             label: "Dashboard",    icon: LayoutDashboard },
  { href: "/appointments", label: "Appointments", icon: CalendarDays    },
  { href: "/clients",      label: "Clients",      icon: Users           },
  { href: "/settings",     label: "Settings",     icon: Settings        },
];

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const w = collapsed ? 64 : 240;

  return (
    <aside
      className="hidden md:flex flex-col h-full flex-shrink-0 border-r transition-all duration-200"
      style={{
        width: w,
        minWidth: w,
        background: "var(--fd-bg-sidebar)",
        borderColor: "var(--fd-border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center h-16 border-b flex-shrink-0 overflow-hidden"
        style={{
          borderColor: "var(--fd-border)",
          padding: collapsed ? "0 16px" : "0 20px",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: collapsed ? 0 : 12,
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "#0fa474" }}
        >
          <Zap size={16} color="white" />
        </div>
        {!collapsed && (
          <span
            className="text-[17px] font-semibold tracking-tight whitespace-nowrap overflow-hidden"
            style={{ color: "var(--fd-text-primary)" }}
          >
            flow<span style={{ color: "#0fa474" }}>desk</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5 overflow-hidden"
        style={{ padding: collapsed ? "12px 8px" : "12px 12px" }}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                collapsed ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-3 py-2"
              )}
              style={
                active
                  ? { background: "var(--fd-accent-muted)", color: "var(--fd-accent)" }
                  : { color: "var(--fd-text-secondary)" }
              }
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.opacity = "0.75";
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.opacity = "1";
              }}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="flex-shrink-0 border-t"
        style={{
          borderColor: "var(--fd-border)",
          padding: collapsed ? "12px 8px" : "12px 16px",
        }}
      >
        {/* User info */}
        {!collapsed && (
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
              style={{ background: "var(--fd-accent-muted)", color: "var(--fd-accent-text)" }}
            >
              SB
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--fd-text-primary)" }}>
                Studio Bella
              </p>
              <p className="text-xs truncate" style={{ color: "var(--fd-text-muted)" }}>
                Pro Plan
              </p>
            </div>
          </div>
        )}

        {/* Collapse toggle + Logout */}
        <div className={cn("flex", collapsed ? "flex-col items-center gap-2" : "items-center justify-between")}>
          {/* Logout */}
          <button
            onClick={() => router.push("/login")}
            title="Sign out"
            className={cn(
              "flex items-center rounded-lg text-xs font-medium transition-colors",
              collapsed ? "w-10 h-10 justify-center" : "gap-2 px-2 py-1.5"
            )}
            style={{ color: "var(--fd-text-muted)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--fd-danger-bg)";
              (e.currentTarget as HTMLElement).style.color = "var(--fd-danger-text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--fd-text-muted)";
            }}
          >
            <LogOut size={15} />
            {!collapsed && "Sign out"}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
            style={{ color: "var(--fd-text-muted)", border: "1px solid var(--fd-border)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-page)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>
      </div>
    </aside>
  );
}
