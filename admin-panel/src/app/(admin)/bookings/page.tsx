"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Search, UserPlus, XCircle } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, Td, Th } from "@/components/ui/table";
import { BookingStatusBadge } from "@/features/bookings/status-badge";
import { currency } from "@/lib/utils";
import { adminApi } from "@/services/admin-api";
import { BookingStatus } from "@/types";

const filters = ["all", "pending", "searching_driver", "driver_assigned", "picked_up", "delivered", "cancelled"] as const;

export default function BookingsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [query, setQuery] = useState("");
  const [assignBooking, setAssignBooking] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["bookings"], queryFn: adminApi.bookings, refetchInterval: 10000 });
  const cancel = useMutation({
    mutationFn: adminApi.cancelBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookings"] })
  });

  const rows = useMemo(() => {
    return (data ?? []).filter((booking) => {
      const matchesSearch = `${booking.id} ${booking.customer} ${booking.assignedDriver ?? ""}`.toLowerCase().includes(query.toLowerCase());
      return matchesSearch && (filter === "all" || booking.status === (filter as BookingStatus));
    });
  }, [data, filter, query]);

  if (isLoading) return <Skeleton className="h-[70vh] w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h1 className="text-3xl font-black">Booking Management</h1>
          <p className="mt-2 text-muted">Live updating bookings with manual operations controls.</p>
        </div>
        <div className="relative w-full xl:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <Input className="pl-10" placeholder="Search bookings" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Button key={item} variant={filter === item ? "default" : "secondary"} size="sm" onClick={() => setFilter(item)}>
            {item.replaceAll("_", " ")}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Bookings</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <thead>
              <tr>
                <Th>Booking ID</Th>
                <Th>Customer</Th>
                <Th>Driver</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Fare</Th>
                <Th>Commission</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((booking) => (
                <tr key={booking.id}>
                  <Td className="font-semibold">{booking.id}</Td>
                  <Td>{booking.customer}</Td>
                  <Td>{booking.assignedDriver ?? "Unassigned"}</Td>
                  <Td>{booking.bookingType}</Td>
                  <Td><BookingStatusBadge status={booking.status} /></Td>
                  <Td>{currency(booking.fare)}</Td>
                  <Td>{currency(booking.commission)}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <Link
                        href={`/bookings/${booking.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition hover:bg-white/10 hover:text-white"
                        aria-label="View booking"
                      >
                        <Eye size={16} />
                      </Link>
                      <Button size="icon" variant="ghost" onClick={() => setAssignBooking(booking.id)}>
                        <UserPlus size={16} />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => cancel.mutate(booking.id)}>
                        <XCircle size={16} />
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
      <Modal open={Boolean(assignBooking)} onOpenChange={() => setAssignBooking(null)} title="Assign driver manually">
        <div className="space-y-4">
          <Input placeholder="Driver ID" />
          <Button className="w-full" onClick={() => setAssignBooking(null)}>Assign driver</Button>
        </div>
      </Modal>
    </div>
  );
}
