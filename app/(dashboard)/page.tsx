"use client";

import { useKPIs, useAppointments } from "@/hooks";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { KPIGrid } from "@/components/dashboard/KPICard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { TodayList } from "@/components/dashboard/TodayList";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export default function DashboardPage() {
  const { kpis, revenueData, activity, period, setPeriod, isLoading } = useKPIs();
  const { appointments, isLoading: apptLoading } = useAppointments({ date: getTodayISO() });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader />
      <KPIGrid kpis={kpis} isLoading={isLoading} />

      {/* Chart + Today — fixed height on desktop, auto-height stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:h-[340px]">
        <div className="lg:col-span-3 h-[280px] lg:h-full">
          <RevenueChart
            data={revenueData}
            period={period}
            onPeriodChange={setPeriod}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-2 lg:h-full">
          <TodayList appointments={appointments} isLoading={apptLoading} />
        </div>
      </div>

      <ActivityFeed items={activity} isLoading={isLoading} className="mt-2" />
    </div>
  );
}
