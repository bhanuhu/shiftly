"use client";

import { useQuery } from "@tanstack/react-query";
import { MoveRight, Radio, Route, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLiveEvents } from "@/hooks/use-live-events";
import { adminApi } from "@/services/admin-api";

export default function LiveOperationsPage() {
  const events = useLiveEvents();
  const { data: bookings = [] } = useQuery({ queryKey: ["bookings"], queryFn: adminApi.bookings, refetchInterval: 7000 });
  const { data: drivers = [] } = useQuery({ queryKey: ["drivers"], queryFn: adminApi.drivers, refetchInterval: 7000 });
  const waiting = bookings.filter((item) => item.status === "pending" || item.status === "searching_driver");
  const active = bookings.filter((item) => ["driver_assigned", "driver_arriving", "picked_up", "in_transit"].includes(item.status));
  const idle = drivers.filter((driver) => driver.onlineStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Live Operations</h1>
        <p className="mt-2 text-muted">Real-time dispatch board for drivers, trips, and waiting bookings.</p>
      </div>
      <section className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader><CardTitle>City dispatch map</CardTitle></CardHeader>
          <CardContent>
            <div className="map-grid relative h-[620px] overflow-hidden rounded-lg border border-border bg-card-2">
              {idle.map((driver, index) => (
                <div
                  key={driver.id}
                  className="absolute flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-accent/15 text-accent shadow-lg"
                  style={{ left: `${18 + index * 16}%`, top: `${24 + (index % 3) * 18}%` }}
                  title={driver.name}
                >
                  <Truck size={17} />
                </div>
              ))}
              {active.map((booking, index) => (
                <div
                  key={booking.id}
                  className="absolute rounded-md border border-border bg-white/90 px-3 py-2 text-xs font-bold text-background shadow-lg"
                  style={{ left: `${35 + index * 12}%`, top: `${52 + index * 8}%` }}
                >
                  {booking.id}
                </div>
              ))}
              <div className="absolute bottom-4 left-4 flex gap-3 rounded-md border border-border bg-background/85 p-3 text-sm text-muted shadow-lg">
                <span className="flex items-center gap-2"><Truck size={16} className="text-accent" />Online drivers</span>
                <span className="flex items-center gap-2"><Route size={16} className="text-white" />Active trips</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <OpsPanel title="Waiting bookings" count={waiting.length} items={waiting.map((item) => item.id)} />
          <OpsPanel title="Active deliveries" count={active.length} items={active.map((item) => item.id)} />
          <OpsPanel title="Drivers idle" count={idle.length} items={idle.map((item) => item.name)} />
          <Card>
            <CardHeader><CardTitle>Live feed</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {events.map((event, index) => (
                <div key={`${event.event}-${index}`} className="rounded-md bg-white/5 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="accent">{event.event}</Badge>
                    <span className="text-xs text-muted">{event.time}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{event.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function OpsPanel({ title, count, items }: { title: string; count: number; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Badge variant="accent">{count}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.slice(0, 4).map((item) => (
          <div key={item} draggable className="flex cursor-grab items-center justify-between rounded-md bg-white/5 p-3">
            <span>{item}</span>
            <Button size="sm" variant="secondary">
              Assign <MoveRight size={14} />
            </Button>
          </div>
        ))}
        {!items.length && <div className="py-4 text-sm text-muted">No items in this queue.</div>}
        <div className="flex items-center gap-2 pt-2 text-xs text-muted">
          <Radio size={14} className="text-accent" />
          Drag-and-drop assignment surface
        </div>
      </CardContent>
    </Card>
  );
}
