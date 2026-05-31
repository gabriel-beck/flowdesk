import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KPI } from "@/types";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";

// ─── Shimmer skeleton ────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded animate-pulse", className)}
      style={{ background: "var(--fd-border-strong)" }}
    />
  );
}

export function KPICardSkeleton() {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: "var(--fd-bg-surface)",
        border: "1px solid var(--fd-border)",
      }}
    >
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
}

// ─── KPI value formatter ─────────────────────────────────────────────

function formatValue(value: number, unit: KPI["unit"]): string {
  if (unit === "currency") return formatCurrency(value);
  if (unit === "percent") return formatPercent(value);
  return value.toLocaleString("en-US");
}

// ─── Delta badge ─────────────────────────────────────────────────────

interface DeltaBadgeProps {
  delta: number;
  deltaType: KPI["deltaType"];
  deltaLabel: string;
  invertColors?: boolean; // true for metrics where "up" is bad (e.g. cancellation rate)
}

function DeltaBadge({ delta, deltaType, deltaLabel, invertColors }: DeltaBadgeProps) {
  const isUp = deltaType === "up";
  const isNeutral = deltaType === "neutral";

  // Invert semantic: for cancellation rate, going up is red
  const isPositive = invertColors ? !isUp : isUp;

  const color = isNeutral
    ? "var(--fd-text-muted)"
    : isPositive
    ? "var(--fd-success-text)"
    : "var(--fd-danger-text)";

  const Icon = isNeutral ? Minus : isUp ? TrendingUp : TrendingDown;

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      <Icon size={13} style={{ color }} />
      <span style={{ color }}>
        {isUp ? "+" : ""}{delta}{typeof delta === "number" && delta % 1 !== 0 ? "%" : ""}
      </span>
      <span style={{ color: "var(--fd-text-muted)" }}>{deltaLabel}</span>
    </div>
  );
}

// ─── KPICard ─────────────────────────────────────────────────────────

interface KPICardProps {
  kpi: KPI;
}

export function KPICard({ kpi }: KPICardProps) {
  const isCancellationRate = kpi.id === "cancellation_rate";

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3 transition-shadow hover:shadow-sm"
      style={{
        background: "var(--fd-bg-surface)",
        border: "1px solid var(--fd-border)",
      }}
    >
      {/* Label */}
      <p
        className="text-xs font-medium uppercase tracking-widest"
        style={{ color: "var(--fd-text-muted)" }}
      >
        {kpi.label}
      </p>

      {/* Value */}
      <p
        className="text-3xl font-semibold tracking-tight"
        style={{
          color: "var(--fd-text-primary)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {formatValue(kpi.value, kpi.unit)}
      </p>

      {/* Delta */}
      <DeltaBadge
        delta={kpi.delta}
        deltaType={kpi.deltaType}
        deltaLabel={kpi.deltaLabel}
        invertColors={isCancellationRate}
      />
    </div>
  );
}

// ─── KPIGrid ─────────────────────────────────────────────────────────

interface KPIGridProps {
  kpis: KPI[];
  isLoading: boolean;
}

export function KPIGrid({ kpis, isLoading }: KPIGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => <KPICardSkeleton key={i} />)
        : kpis.map((kpi) => <KPICard key={kpi.id} kpi={kpi} />)}
    </div>
  );
}
