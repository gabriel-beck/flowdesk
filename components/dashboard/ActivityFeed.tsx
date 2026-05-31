import type { ActivityItem, ActivityType } from "@/types";
import {
  CalendarPlus,
  CalendarX,
  UserPlus,
  DollarSign,
} from "lucide-react";

// ─── Skeleton ────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded animate-pulse ${className}`}
      style={{ background: "var(--fd-border-strong)" }}
    />
  );
}

export function ActivityFeedSkeleton() {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--fd-bg-surface)",
        border: "1px solid var(--fd-border)",
      }}
    >
      <Skeleton className="h-4 w-32 mb-5" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="w-7 h-7 rounded-lg flex-shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Icon map ────────────────────────────────────────────────────────

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { Icon: React.ElementType; bg: string; color: string }
> = {
  appointment_created: {
    Icon: CalendarPlus,
    bg: "var(--fd-success-bg)",
    color: "var(--fd-success-text)",
  },
  appointment_cancelled: {
    Icon: CalendarX,
    bg: "var(--fd-danger-bg)",
    color: "var(--fd-danger-text)",
  },
  client_created: {
    Icon: UserPlus,
    bg: "var(--fd-accent-muted)",
    color: "var(--fd-accent-text)",
  },
  payment_received: {
    Icon: DollarSign,
    bg: "var(--fd-warning-bg)",
    color: "var(--fd-warning-text)",
  },
};

// ─── ActivityRow ─────────────────────────────────────────────────────

function ActivityRow({ item }: { item: ActivityItem }) {
  const config = ACTIVITY_CONFIG[item.type];
  const { Icon } = config;

  return (
    <div className="flex items-start gap-3">
      {/* Icon */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: config.bg }}
      >
        <Icon size={13} style={{ color: config.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm" style={{ color: "var(--fd-text-primary)" }}>
          {item.description}
          {item.clientName && (
            <span
              className="font-medium"
              style={{ color: "var(--fd-text-secondary)" }}
            >
              {" "}— {item.clientName}
            </span>
          )}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--fd-text-muted)" }}>
          {item.time}
        </p>
      </div>
    </div>
  );
}

// ─── ActivityFeed ────────────────────────────────────────────────────

interface ActivityFeedProps {
  items: ActivityItem[];
  isLoading: boolean;
  className?: string;
}

export function ActivityFeed({ items, isLoading, className }: ActivityFeedProps) {
  if (isLoading) return <ActivityFeedSkeleton />;

  return (
    <div
      className={`rounded-xl p-5${className ? ` ${className}` : ""}`}
      style={{
        background: "var(--fd-bg-surface)",
        border: "1px solid var(--fd-border)",
      }}
    >
      <p
        className="text-sm font-medium mb-5"
        style={{ color: "var(--fd-text-primary)" }}
      >
        Recent Activity
      </p>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <ActivityRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
