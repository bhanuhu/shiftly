"use client";

import { useQuery } from "@tanstack/react-query";
import { RefreshCcw, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, Td, Th } from "@/components/ui/table";
import { currency } from "@/lib/utils";
import { adminApi } from "@/services/admin-api";

export default function PaymentsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["payments"], queryFn: adminApi.payments });
  if (isLoading) return <Skeleton className="h-[70vh] w-full" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Payment Management</h1>
        <p className="mt-2 text-muted">Track customer payments, failed transactions, refunds, and driver payouts.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        {["All payments", "Failed payments", "Refunded", "Pending settlements"].map((item, index) => (
          <Card key={item}>
            <CardContent className="p-5">
              <p className="text-sm text-muted">{item}</p>
              <div className="mt-3 text-2xl font-black">{index === 0 ? data?.length : index + 1}</div>
            </CardContent>
          </Card>
        ))}
      </section>
      <Card>
        <CardHeader><CardTitle>Payments</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <thead>
              <tr><Th>ID</Th><Th>Booking</Th><Th>Customer</Th><Th>Driver</Th><Th>Amount</Th><Th>Status</Th><Th>Actions</Th></tr>
            </thead>
            <tbody>
              {data?.map((payment) => (
                <tr key={payment.id}>
                  <Td>{payment.id}</Td>
                  <Td>{payment.bookingId}</Td>
                  <Td>{payment.customer}</Td>
                  <Td>{payment.driver}</Td>
                  <Td>{currency(payment.amount)}</Td>
                  <Td><Badge variant={payment.status === "paid" ? "success" : payment.status === "failed" ? "danger" : "warning"}>{payment.status}</Badge></Td>
                  <Td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary"><RefreshCcw size={14} />Payout</Button>
                      <Button size="sm" variant="outline"><RotateCcw size={14} />Refund</Button>
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
