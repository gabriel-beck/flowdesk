"use client";

import { Search, X } from "lucide-react";
import type { ClientStatus } from "@/types";

const STATUS_FILTERS: { value: ClientStatus | "all"; label: string }[] = [
  { value: "all",      label: "All"      },
  { value: "active",   label: "Active"   },
  { value: "vip",      label: "VIP"      },
  { value: "inactive", label: "Inactive" },
];

interface ClientFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: ClientStatus | "all";
  onStatusChange: (v: ClientStatus | "all") => void;
  totalCount: number;
}

export function ClientFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  totalCount,
}: ClientFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--fd-text-muted)" }}
        />
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-8 pr-8 py-2 rounded-lg text-sm outline-none transition-colors"
          style={{
            background: "var(--fd-bg-surface)",
            border: "1px solid var(--fd-border)",
            color: "var(--fd-text-primary)",
          }}
          onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--fd-accent)"; }}
          onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--fd-border)"; }}
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--fd-text-muted)" }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-0.5">
        {/* Status pills */}
        <div
          className="flex items-center gap-0.5 rounded-lg p-1"
          style={{ background: "var(--fd-bg-surface)", border: "1px solid var(--fd-border)" }}
        >
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onStatusChange(value)}
              className="px-3 py-1 rounded-md text-xs font-medium transition-all"
              style={
                status === value
                  ? { background: "var(--fd-accent)", color: "#fff" }
                  : { color: "var(--fd-text-secondary)" }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Count */}
        <span className="text-xs flex-shrink-0" style={{ color: "var(--fd-text-muted)" }}>
          {totalCount} client{totalCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
