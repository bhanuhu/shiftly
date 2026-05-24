"use client";

import { CheckCircle, RotateCcw, ShieldX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const incidents = [
  { id: "INC-2101", type: "Customer complaint", subject: "Driver delayed pickup", status: "open" },
  { id: "INC-2102", type: "Driver complaint", subject: "Customer changed drop address", status: "review" },
  { id: "INC-2103", type: "Failed delivery", subject: "Goods could not be delivered", status: "open" },
  { id: "INC-2104", type: "Dispute", subject: "Fare refund requested", status: "resolved" }
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">Support and Incidents</h1>
        <p className="mt-2 text-muted">Resolve complaints, disputes, failed deliveries, and operational escalations.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Incident queue</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {incidents.map((incident) => (
            <div key={incident.id} className="flex flex-col justify-between gap-3 rounded-lg border border-border bg-white/5 p-4 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{incident.id}</span>
                  <Badge variant={incident.status === "resolved" ? "success" : "warning"}>{incident.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted">{incident.type} · {incident.subject}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary"><CheckCircle size={14} />Resolve</Button>
                <Button size="sm" variant="outline"><RotateCcw size={14} />Refund</Button>
                <Button size="sm" variant="destructive"><ShieldX size={14} />Suspend</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
