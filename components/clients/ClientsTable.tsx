"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown, MoreHorizontal, Eye, Trash2, Users } from "lucide-react";
import type { Client, ClientStatus } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useDropdown } from "@/hooks/useDropdown";

// ─── Status config ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ClientStatus, { label: string; bg: string; text: string }> = {
  active:   { label: "Active",   bg: "var(--fd-success-bg)",  text: "var(--fd-success-text)" },
  vip:      { label: "VIP",      bg: "var(--fd-vip-bg)",      text: "var(--fd-vip-text)"     },
  inactive: { label: "Inactive", bg: "var(--fd-bg-page)",     text: "var(--fd-text-muted)"   },
};

const ROW_ACTIONS = [
  { icon: Eye,    label: "View Details", color: "var(--fd-text-primary)" },
  { icon: Trash2, label: "Delete",       color: "var(--fd-danger-text)"  },
];

// ─── Skeleton ─────────────────────────────────────────────────────────

function Sk({ className }: { className?: string }) {
  return <div className={`rounded animate-pulse ${className}`} style={{ background: "var(--fd-border-strong)" }} />;
}

export function ClientsTableSkeleton() {
  return (
    <>
      {/* Mobile skeleton */}
      <div className="sm:hidden rounded-xl overflow-hidden" style={{ border: "1px solid var(--fd-border)" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border-b last:border-0" style={{ borderColor: "var(--fd-border)", background: "var(--fd-bg-surface)" }}>
            <div className="flex items-center gap-3">
              <Sk className="w-9 h-9 rounded-full flex-shrink-0" />
              <div className="flex flex-col gap-1.5">
                <Sk className="h-3 w-28" />
                <Sk className="h-5 w-20 rounded-full" />
              </div>
            </div>
            <Sk className="w-7 h-7 rounded-md" />
          </div>
        ))}
      </div>

      {/* Desktop skeleton */}
      <div className="hidden sm:block rounded-xl overflow-hidden" style={{ border: "1px solid var(--fd-border)" }}>
        <table className="w-full">
          <thead style={{ background: "var(--fd-bg-surface-2)", borderBottom: "1px solid var(--fd-border)" }}>
            <tr>
              {["Client", "Last Appointment", "Total Spent", "Appointments", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left"><Sk className="h-3 w-20" /></th>
              ))}
            </tr>
          </thead>
          <tbody style={{ background: "var(--fd-bg-surface)" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--fd-border)" }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Sk className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex flex-col gap-1.5"><Sk className="h-3 w-28" /><Sk className="h-2.5 w-36" /></div>
                  </div>
                </td>
                <td className="px-4 py-3"><Sk className="h-3 w-24" /></td>
                <td className="px-4 py-3"><Sk className="h-3 w-16" /></td>
                <td className="px-4 py-3"><Sk className="h-3 w-8" /></td>
                <td className="px-4 py-3"><Sk className="h-5 w-16 rounded-full" /></td>
                <td className="px-4 py-3"><Sk className="h-6 w-6 rounded-md" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────

function EmptyState({ search }: { search: string }) {
  return (
    <div className="rounded-xl flex flex-col items-center justify-center py-16 gap-3"
      style={{ border: "1px solid var(--fd-border)", background: "var(--fd-bg-surface)" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--fd-bg-page)" }}>
        <Users size={18} style={{ color: "var(--fd-text-muted)" }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium" style={{ color: "var(--fd-text-secondary)" }}>No clients found</p>
        <p className="text-xs mt-1" style={{ color: "var(--fd-text-muted)" }}>
          {search ? `No results for "${search}"` : "Add your first client to get started."}
        </p>
      </div>
    </div>
  );
}

// ─── Actions dropdown ─────────────────────────────────────────────────

function ActionsMenu({ client, onView }: { client: Client; onView: () => void }) {
  const { isOpen, toggle, close, ref } = useDropdown();
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); toggle(); }}
        className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
        style={{ color: "var(--fd-text-muted)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-border)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        <MoreHorizontal size={15} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-8 z-50 rounded-lg overflow-hidden shadow-xl"
          style={{ background: "var(--fd-bg-surface-2)", border: "1px solid var(--fd-border-strong)", minWidth: 140 }}>
          {ROW_ACTIONS.map(({ icon: Icon, label, color }) => (
            <button key={label}
              onClick={() => { if (label === "View Details") onView(); else console.log(label, client.id); close(); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors text-left"
              style={{ color }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-border)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <Icon size={14} />{label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────

function MobileClientCard({ client, onView }: { client: Client; onView: () => void }) {
  const s = STATUS_CONFIG[client.status];
  const isVip = client.status === "vip";
  return (
    <div
      className="flex items-center justify-between p-4 border-b last:border-0 cursor-pointer transition-colors"
      style={{ borderColor: "var(--fd-border)", background: "var(--fd-bg-surface)" }}
      onClick={onView}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-surface-2)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-surface)"; }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
          style={{
            background: isVip ? "var(--fd-vip-bg)" : "var(--fd-bg-page)",
            color: isVip ? "var(--fd-vip-text)" : "var(--fd-text-secondary)",
            border: isVip ? "1.5px solid var(--fd-vip-border)" : "1px solid var(--fd-border)",
          }}
        >
          {client.avatarInitials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: "var(--fd-text-primary)" }}>{client.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: s.bg, color: s.text }}>{s.label}</span>
            <span className="text-xs tabular-nums" style={{ color: "var(--fd-text-muted)", fontFamily: "var(--font-mono)" }}>
              {formatCurrency(client.totalSpent)}
            </span>
          </div>
        </div>
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <ActionsMenu client={client} onView={onView} />
      </div>
    </div>
  );
}

// ─── Sort icon ────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <ChevronsUpDown size={13} style={{ color: "var(--fd-text-muted)", opacity: 0.5 }} />;
  return dir === "asc"
    ? <ChevronUp size={13} style={{ color: "var(--fd-accent)" }} />
    : <ChevronDown size={13} style={{ color: "var(--fd-accent)" }} />;
}

// ─── Pagination ───────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPrev, onNext }: {
  page: number; totalPages: number; onPrev: () => void; onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3"
      style={{ borderTop: "1px solid var(--fd-border)", background: "var(--fd-bg-surface)" }}>
      <span className="text-xs" style={{ color: "var(--fd-text-muted)" }}>Page {page} of {totalPages}</span>
      <div className="flex items-center gap-2">
        <button onClick={onPrev} disabled={page === 1}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ border: "1px solid var(--fd-border)", color: "var(--fd-text-secondary)" }}
          onMouseEnter={(e) => { if (page > 1) (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-page)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          Previous
        </button>
        <button onClick={onNext} disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ border: "1px solid var(--fd-border)", color: "var(--fd-text-secondary)" }}
          onMouseEnter={(e) => { if (page < totalPages) (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-page)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
          Next
        </button>
      </div>
    </div>
  );
}

// ─── Column definitions ───────────────────────────────────────────────

type SortableKey = "name" | "lastAppointment" | "totalSpent" | "totalAppointments";

const COLUMNS: { key: SortableKey | null; label: string; width?: string }[] = [
  { key: "name",              label: "Client",           width: "40%" },
  { key: "lastAppointment",   label: "Last Appointment", width: "20%" },
  { key: "totalSpent",        label: "Total Spent",      width: "15%" },
  { key: "totalAppointments", label: "Appts",            width: "10%" },
  { key: null,                label: "Status",           width: "10%" },
  { key: null,                label: "",                 width: "5%"  },
];

// ─── ClientsTable ─────────────────────────────────────────────────────

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
  search: string;
  sortBy: SortableKey;
  sortDir: "asc" | "desc";
  onSort: (key: SortableKey) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onClientClick: (client: Client) => void;
}

export function ClientsTable({
  clients, isLoading, search, sortBy, sortDir,
  onSort, page, totalPages, onPageChange, onClientClick,
}: ClientsTableProps) {
  if (isLoading) return <ClientsTableSkeleton />;
  if (clients.length === 0) return <EmptyState search={search} />;

  return (
    <>
      {/* Mobile — card list, zero horizontal scroll */}
      <div className="sm:hidden rounded-xl overflow-hidden" style={{ border: "1px solid var(--fd-border)" }}>
        {clients.map((c) => (
          <MobileClientCard key={c.id} client={c} onView={() => onClientClick(c)} />
        ))}
        <Pagination page={page} totalPages={totalPages} onPrev={() => onPageChange(page - 1)} onNext={() => onPageChange(page + 1)} />
      </div>

      {/* Desktop — sortable table */}
      <div className="hidden sm:block rounded-xl overflow-hidden" style={{ border: "1px solid var(--fd-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: "var(--fd-bg-surface-2)", borderBottom: "1px solid var(--fd-border)" }}>
              <tr>
                {COLUMNS.map(({ key, label, width }) => (
                  <th key={label} className="px-4 py-3 text-left" style={{ width }}>
                    {key ? (
                      <button onClick={() => onSort(key)}
                        className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider transition-colors"
                        style={{ color: sortBy === key ? "var(--fd-text-primary)" : "var(--fd-text-muted)" }}>
                        {label}<SortIcon active={sortBy === key} dir={sortDir} />
                      </button>
                    ) : (
                      <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--fd-text-muted)" }}>{label}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ background: "var(--fd-bg-surface)" }}>
              {clients.map((client) => (
                <tr key={client.id} onClick={() => onClientClick(client)}
                  className="cursor-pointer transition-colors"
                  style={{ borderBottom: "1px solid var(--fd-border)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--fd-bg-surface-2)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                        style={{
                          background: client.status === "vip" ? "var(--fd-vip-bg)" : "var(--fd-bg-page)",
                          color: client.status === "vip" ? "var(--fd-vip-text)" : "var(--fd-text-secondary)",
                          border: client.status === "vip" ? "1.5px solid var(--fd-vip-border)" : "1px solid var(--fd-border)",
                        }}>
                        {client.avatarInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--fd-text-primary)" }}>{client.name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--fd-text-muted)" }}>{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm" style={{ color: "var(--fd-text-secondary)" }}>
                      {client.lastAppointment ? formatDate(client.lastAppointment) : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium tabular-nums"
                      style={{ color: "var(--fd-text-primary)", fontFamily: "var(--font-mono)" }}>
                      {formatCurrency(client.totalSpent)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm" style={{ color: "var(--fd-text-secondary)" }}>{client.totalAppointments}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: STATUS_CONFIG[client.status].bg, color: STATUS_CONFIG[client.status].text }}>
                      {STATUS_CONFIG[client.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ActionsMenu client={client} onView={() => onClientClick(client)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} onPrev={() => onPageChange(page - 1)} onNext={() => onPageChange(page + 1)} />
      </div>
    </>
  );
}
