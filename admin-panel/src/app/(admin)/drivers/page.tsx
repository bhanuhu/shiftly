"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Search, ShieldCheck, ShieldX, WifiOff } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, Td, Th } from "@/components/ui/table";
import { VerificationBadge } from "@/features/drivers/status-badge";
import { currency } from "@/lib/utils";
import { adminApi } from "@/services/admin-api";
import { VerificationStatus } from "@/types";

const filters = ["all", "pending", "approved", "suspended", "online", "offline"] as const;

export default function DriversPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["drivers"], queryFn: adminApi.drivers });
  const action = useMutation({
    mutationFn: ({ id, type }: { id: string; type: VerificationStatus }) =>
      type === "approved" ? adminApi.approveDriver(id) : type === "rejected" ? adminApi.rejectDriver(id) : adminApi.suspendDriver(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["drivers"] })
  });

  const rows = useMemo(() => {
    return (data ?? []).filter((driver) => {
      const matchesSearch = `${driver.name} ${driver.phone} ${driver.vehicleNumber}`.toLowerCase().includes(query.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        driver.verificationStatus === filter ||
        (filter === "online" && driver.onlineStatus) ||
        (filter === "offline" && !driver.onlineStatus);
      return matchesSearch && matchesFilter;
    });
  }, [data, filter, query]);

  if (isLoading) return <Skeleton className="h-[70vh] w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">Driver Management</h1>
          <p className="mt-2 text-muted">Approve, suspend, and monitor drivers across live operations.</p>
        </div>
        <div className="relative w-full xl:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <Input className="pl-10" placeholder="Search drivers" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Button key={item} variant={filter === item ? "default" : "secondary"} size="sm" onClick={() => setFilter(item)}>
            {item}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Drivers</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <thead>
              <tr>
                <Th>Driver</Th>
                <Th>Vehicle</Th>
                <Th>Status</Th>
                <Th>Rating</Th>
                <Th>Trips</Th>
                <Th>Earnings</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((driver) => (
                <tr key={driver.id}>
                  <Td>
                    <div className="font-semibold">{driver.name}</div>
                    <div className="text-xs text-muted">{driver.phone}</div>
                  </Td>
                  <Td>
                    <div>{driver.vehicleType}</div>
                    <div className="text-xs text-muted">{driver.vehicleNumber}</div>
                  </Td>
                  <Td>
                    <div className="flex flex-col gap-2">
                      <VerificationBadge status={driver.verificationStatus} />
                      <Badge variant={driver.onlineStatus ? "accent" : "neutral"}>{driver.onlineStatus ? "online" : "offline"}</Badge>
                    </div>
                  </Td>
                  <Td>{driver.rating.toFixed(1)}</Td>
                  <Td>{driver.totalTrips}</Td>
                  <Td>{currency(driver.earnings)}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <Link
                        href={`/drivers/${driver.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition hover:bg-white/10 hover:text-white"
                        aria-label="View driver"
                      >
                        <Eye size={16} />
                      </Link>
                      <Button size="icon" variant="ghost" onClick={() => action.mutate({ id: driver.id, type: "approved" })}>
                        <ShieldCheck size={16} />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => action.mutate({ id: driver.id, type: "rejected" })}>
                        <ShieldX size={16} />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => action.mutate({ id: driver.id, type: "suspended" })}>
                        <WifiOff size={16} />
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
