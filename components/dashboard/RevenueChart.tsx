"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RevenueDataPoint } from "@/types";
import { formatCurrency } from "@/lib/utils";

// ─── Skeleton ────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded animate-pulse ${className}`}
      style={{ background: "var(--fd-border-strong)" }}
    />
  );
}

export function RevenueChartSkeleton() {
  return (
    <div
      className="rounded-xl p-5 h-full flex flex-col"
      style={{
        background: "var(--fd-bg-surface)",
        border: "1px solid var(--fd-border)",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-36 rounded-lg" />
      </div>
      <Skeleton className="flex-1 w-full rounded-lg" />
    </div>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────

interface TooltipPayload {
  value: number;
  payload: RevenueDataPoint;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div
      className="rounded-lg px-3 py-2.5 text-xs shadow-lg"
      style={{
        background: "var(--fd-bg-surface-2)",
        border: "1px solid var(--fd-border-strong)",
        color: "var(--fd-text-primary)",
      }}
    >
      <p className="font-medium mb-1" style={{ color: "var(--fd-text-secondary)" }}>
        {label}
      </p>
      <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-mono)", color: "var(--fd-accent)" }}>
        {formatCurrency(data.revenue)}
      </p>
      <p style={{ color: "var(--fd-text-muted)" }}>{data.appointments} appointments</p>
    </div>
  );
}

// ─── Period toggle ───────────────────────────────────────────────────

interface PeriodToggleProps {
  period: "weekly" | "monthly";
  onChange: (p: "weekly" | "monthly") => void;
}

function PeriodToggle({ period, onChange }: PeriodToggleProps) {
  const options: { value: "weekly" | "monthly"; label: string }[] = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];
  return (
    <div
      className="flex items-center gap-0.5 rounded-lg p-1 text-xs font-medium"
      style={{ background: "var(--fd-bg-page)", border: "1px solid var(--fd-border)" }}
    >
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className="px-3 py-1 rounded-md transition-all"
          style={
            period === value
              ? { background: "var(--fd-bg-surface)", color: "var(--fd-text-primary)", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }
              : { color: "var(--fd-text-muted)" }
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── RevenueChart ────────────────────────────────────────────────────

interface RevenueChartProps {
  data: RevenueDataPoint[];
  period: "weekly" | "monthly";
  onPeriodChange: (p: "weekly" | "monthly") => void;
  isLoading: boolean;
}

export function RevenueChart({ data, period, onPeriodChange, isLoading }: RevenueChartProps) {
  if (isLoading) return <RevenueChartSkeleton />;

  return (
    <div
      className="rounded-xl p-5 h-full flex flex-col"
      style={{ background: "var(--fd-bg-surface)", border: "1px solid var(--fd-border)" }}
    >
      {/* Header — fixed */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--fd-text-primary)" }}>
            Revenue
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--fd-text-muted)" }}>
            {period === "weekly" ? "Last 7 days" : "Last 6 months"}
          </p>
        </div>
        <PeriodToggle period={period} onChange={onPeriodChange} />
      </div>

      {/* Chart — grows to fill remaining card space */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0fa474" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#0fa474" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--fd-border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--fd-text-muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--fd-text-muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--fd-border-strong)", strokeWidth: 1 }} />
            <Area type="monotone" dataKey="revenue" stroke="#0fa474" strokeWidth={2} fill="url(#revenueGradient)" dot={false} activeDot={{ r: 4, fill: "#0fa474", strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
