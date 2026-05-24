"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const schema = z.object({
  baseFare: z.coerce.number().min(0),
  perKmRate: z.coerce.number().min(0),
  expressMultiplier: z.coerce.number().min(1),
  sharedDiscount: z.coerce.number().min(0).max(100),
  minimumFare: z.coerce.number().min(0),
  driverPayout: z.coerce.number().min(0).max(100),
  platformCommission: z.coerce.number().min(0).max(100)
});

export default function PricingPage() {
  const { register, handleSubmit, formState: { isSubmitSuccessful } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      baseFare: 60,
      perKmRate: 18,
      expressMultiplier: 1.25,
      sharedDiscount: 18,
      minimumFare: 80,
      driverPayout: 82,
      platformCommission: 18
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">Pricing Management</h1>
        <p className="mt-2 text-muted">Control fare rules, shared delivery discounts, and payout economics.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Editable pricing rules</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" onSubmit={handleSubmit(() => undefined)}>
            <Field label="Base fare" inputProps={register("baseFare")} />
            <Field label="Per km rate" inputProps={register("perKmRate")} />
            <Field label="Express multiplier" inputProps={register("expressMultiplier")} />
            <Field label="Shared discount %" inputProps={register("sharedDiscount")} />
            <Field label="Minimum fare" inputProps={register("minimumFare")} />
            <Field label="Driver payout %" inputProps={register("driverPayout")} />
            <Field label="Platform commission %" inputProps={register("platformCommission")} />
            <div className="flex items-end">
              <Button className="w-full"><Save size={16} />Save changes</Button>
            </div>
          </form>
          {isSubmitSuccessful && <p className="mt-4 text-sm text-accent">Pricing rules saved locally.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, inputProps }: { label: string; inputProps: Record<string, unknown> }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-muted">{label}</span>
      <Input type="number" step="0.01" {...inputProps} />
    </label>
  );
}
