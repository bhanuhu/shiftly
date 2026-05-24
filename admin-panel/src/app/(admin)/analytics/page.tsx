"use client";

import { BookingsAreaChart, RevenueBarChart, StatusPieChart, ZonesChart } from "@/components/charts/ops-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Analytics</h1>
        <p className="mt-2 text-muted">Operational, financial, and driver performance analytics.</p>
      </div>
      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Daily bookings"><BookingsAreaChart /></ChartCard>
        <ChartCard title="Revenue and commissions"><RevenueBarChart /></ChartCard>
        <ChartCard title="Top zones"><ZonesChart /></ChartCard>
        <ChartCard title="Shared booking success rate"><StatusPieChart /></ChartCard>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Average delivery time", "38 min"],
          ["Active users", "1,284"],
          ["Driver performance", "94% SLA"]
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted">{label}</p>
              <div className="mt-3 text-2xl font-black">{value}</div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
