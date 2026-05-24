"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShieldCheck, ShieldX } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { VerificationBadge } from "@/features/drivers/status-badge";
import { currency } from "@/lib/utils";
import { adminApi } from "@/services/admin-api";

export default function DriverDetailPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useQuery({ queryKey: ["drivers"], queryFn: adminApi.drivers });
  const driver = data?.find((item) => item.id === params.id);

  if (isLoading) return <Skeleton className="h-[70vh] w-full" />;
  if (!driver) return <Card><CardContent>Driver not found.</CardContent></Card>;

  return (
    <div className="space-y-6">
      <Link href="/drivers" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white">
        <ArrowLeft size={16} />
        Back to drivers
      </Link>
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h1 className="text-3xl font-black">{driver.name}</h1>
          <p className="mt-2 text-muted">{driver.phone}</p>
        </div>
        <div className="flex gap-2">
          <Button><ShieldCheck size={16} />Approve</Button>
          <Button variant="destructive"><ShieldX size={16} />Suspend</Button>
        </div>
      </div>
      <section className="grid gap-4 xl:grid-cols-[1fr_.9fr]">
        <Card>
          <CardHeader><CardTitle>Personal and vehicle info</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Info label="Vehicle type" value={driver.vehicleType} />
            <Info label="Vehicle number" value={driver.vehicleNumber} />
            <Info label="Rating" value={driver.rating.toFixed(1)} />
            <Info label="Total trips" value={String(driver.totalTrips)} />
            <Info label="Earnings" value={currency(driver.earnings)} />
            <div>
              <div className="text-xs uppercase text-muted">Verification</div>
              <div className="mt-2"><VerificationBadge status={driver.verificationStatus} /></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Live location</CardTitle></CardHeader>
          <CardContent>
            <div className="map-grid relative h-72 overflow-hidden rounded-lg border border-border bg-card-2">
              <div className="absolute left-[58%] top-[42%] h-5 w-5 rounded-full bg-accent shadow-glow" />
              <div className="absolute bottom-4 left-4 rounded-md bg-background/80 px-3 py-2 text-sm text-muted">
                {driver.currentLat ?? 28.61}, {driver.currentLng ?? 77.2}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-4 xl:grid-cols-3">
        {["Aadhaar", "Driving license", "Profile photo"].map((item) => (
          <Card key={item}>
            <CardHeader><CardTitle>{item}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-white/5 text-muted">
                Uploaded document preview
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
      <Card>
        <CardHeader><CardTitle>Recent trip and earnings history</CardTitle></CardHeader>
        <CardContent className="grid gap-3">
          {["BKG-48291", "BKG-48280", "BKG-48166"].map((id, index) => (
            <div key={id} className="flex items-center justify-between rounded-md bg-white/5 p-3">
              <span>{id}</span>
              <Badge variant={index === 0 ? "accent" : "success"}>{index === 0 ? "active" : "paid"}</Badge>
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
