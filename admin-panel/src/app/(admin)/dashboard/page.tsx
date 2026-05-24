"use client";

import { Activity, Banknote, CircleDollarSign, PackageCheck, Radio, Share2, ShieldAlert, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { BookingsAreaChart, RevenueBarChart, StatusPieChart, ZonesChart } from "@/components/charts/ops-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MetricCard } from "@/features/dashboard/metric-card";
import { currency } from "@/lib/utils";
import { adminApi } from "@/services/admin-api";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: adminApi.dashboard });

  if (isLoading || !data) {
    return <Skeleton className="h-[70vh] w-full" />;
  }

  const cards = [
    { label: "Total Bookings Today", value: String(data.totalBookingsToday), icon: PackageCheck, hint: "+12% vs yesterday" },
    { label: "Active Deliveries", value: String(data.activeDeliveries), icon: Activity, hint: "Live trips in progress" },
    { label: "Online Drivers", value: String(data.onlineDrivers), icon: Radio, hint: "Available in dispatch radius" },
    { label: "Pending Approvals", value: String(data.pendingApprovals), icon: Truck, hint: "Documents awaiting review" },
    { label: "Revenue Today", value: currency(data.revenueToday), icon: Banknote, hint: "Gross booking value" },
    { label: "Total Commission", value: currency(data.totalCommission), icon: CircleDollarSign, hint: "Platform commission" },
    { label: "Failed Deliveries", value: String(data.failedDeliveries), icon: ShieldAlert, hint: "Needs ops review" },
    { label: "Shared Deliveries", value: String(data.sharedDeliveries), icon: Share2, hint: "Batched active count" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">Dashboard</h1>
        <p className="mt-2 text-muted">Real-time overview of SHIFTLY operations.</p>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bookings over time</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingsAreaChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueBarChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top active zones</CardTitle>
          </CardHeader>
          <CardContent>
            <ZonesChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Booking status distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPieChart />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
