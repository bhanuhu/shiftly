"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingStatusBadge } from "@/features/bookings/status-badge";
import { currency } from "@/lib/utils";
import { adminApi } from "@/services/admin-api";

const timeline = ["booking created", "searching", "driver assigned", "picked up", "in transit", "delivered"];

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useQuery({ queryKey: ["bookings"], queryFn: adminApi.bookings });
  const booking = data?.find((item) => item.id === params.id);

  if (isLoading) return <Skeleton className="h-[70vh] w-full" />;
  if (!booking) return <Card><CardContent>Booking not found.</CardContent></Card>;

  return (
    <div className="space-y-6">
      <Link href="/bookings" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white">
        <ArrowLeft size={16} />
        Back to bookings
      </Link>
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h1 className="text-3xl font-black">{booking.id}</h1>
          <div className="mt-2"><BookingStatusBadge status={booking.status} /></div>
        </div>
        <div className="flex gap-2">
          <Button><RotateCcw size={16} />Reassign driver</Button>
          <Button variant="destructive"><XCircle size={16} />Cancel booking</Button>
        </div>
      </div>
      <section className="grid gap-4 xl:grid-cols-[1fr_.9fr]">
        <Card>
          <CardHeader><CardTitle>Route map</CardTitle></CardHeader>
          <CardContent>
            <div className="map-grid relative h-96 overflow-hidden rounded-lg border border-border bg-card-2">
              <div className="absolute left-[22%] top-[36%] h-4 w-4 rounded-full bg-accent" />
              <div className="absolute left-[68%] top-[58%] h-4 w-4 rounded-full bg-destructive" />
              <div className="absolute left-[43%] top-[47%] h-5 w-5 rounded-full bg-white shadow-glow" />
              <div className="absolute bottom-4 left-4 rounded-md bg-background/80 px-3 py-2 text-sm">
                {booking.pickup} → {booking.drop}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Trip details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Info label="Customer" value={booking.customer} />
            <Info label="Assigned driver" value={booking.assignedDriver ?? "Unassigned"} />
            <Info label="Booking type" value={booking.bookingType} />
            <Info label="Fare" value={currency(booking.fare)} />
            <Info label="Commission" value={currency(booking.commission)} />
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardHeader><CardTitle>Status timeline</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-6">
          {timeline.map((item, index) => (
            <div key={item} className="rounded-lg border border-border bg-white/5 p-4">
              <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-black text-background">{index + 1}</div>
              <div className="text-sm font-semibold capitalize">{item}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase text-muted">{label}</div>
      <div className="mt-2 font-semibold">{value}</div>
    </div>
  );
}
