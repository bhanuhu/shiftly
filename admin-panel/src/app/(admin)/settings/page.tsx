"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">Settings</h1>
        <p className="mt-2 text-muted">Manage admin users, notifications, business info, API keys, and feature flags.</p>
      </div>
      <section className="grid gap-4 xl:grid-cols-2">
        <SettingsCard title="Business info" fields={["Company name", "Support email", "Support phone"]} />
        <SettingsCard title="Notification settings" fields={["SMS provider", "Push provider", "Alert webhook"]} />
        <SettingsCard title="API keys" fields={["Maps API key", "Payment key", "Cloud storage key"]} />
        <Card>
          <CardHeader><CardTitle>Feature flags</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {["Shared delivery batching", "Auto reassignment", "Driver payout automation"].map((item) => (
              <label key={item} className="flex items-center justify-between rounded-md bg-white/5 p-3">
                <span>{item}</span>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-[#A3D65C]" />
              </label>
            ))}
            <Button><Save size={16} />Save settings</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function SettingsCard({ title, fields }: { title: string; fields: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <label key={field} className="block">
            <span className="mb-2 block text-sm text-muted">{field}</span>
            <Input />
          </label>
        ))}
        <Button><Save size={16} />Save</Button>
      </CardContent>
    </Card>
  );
}
