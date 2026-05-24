import { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({ label, value, icon: Icon, hint }: { label: string; value: string; icon: LucideIcon; hint: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">{label}</p>
            <div className="mt-3 text-2xl font-black text-white">{value}</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/15 text-accent">
            <Icon size={20} />
          </div>
        </div>
        <p className="mt-4 text-xs text-muted">{hint}</p>
      </CardContent>
    </Card>
  );
}
