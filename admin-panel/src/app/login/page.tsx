"use client";

import { ArrowRight, Lock, Phone } from "lucide-react";
import { FormEvent, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  phoneOrEmail: z.string().min(3, "Enter phone or email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginValues = z.infer<typeof schema>;

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const [values, setValues] = useState<LoginValues>({ phoneOrEmail: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginValues, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const formatted = result.error.flatten().fieldErrors;
      setErrors({
        phoneOrEmail: formatted.phoneOrEmail?.[0],
        password: formatted.password?.[0]
      });
      return;
    }
    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await login(result.data.phoneOrEmail, result.data.password);
      document.cookie = "shiftly_admin_token=1; path=/; max-age=2592000; SameSite=Lax";
      window.location.assign("/dashboard");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to login. Check that the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <section className="flex flex-col justify-center">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-md border border-accent/25 bg-accent/10 text-accent">
            <Phone size={26} />
          </div>
          <h1 className="max-w-xl text-5xl font-black leading-tight text-white">SHIFTLY Admin</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
            A real-time command center for bookings, drivers, pricing, payouts, support, and city operations.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-muted sm:grid-cols-3">
            {["Live dispatch", "Driver approvals", "Revenue control"].map((item) => (
              <div key={item} className="rounded-lg border border-border bg-white/[0.04] p-4">
                {item}
              </div>
            ))}
          </div>
        </section>
        <Card className="shadow-2xl">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">Admin login</h2>
              <p className="mt-2 text-sm text-muted">Use your admin credentials to continue.</p>
            </div>
            <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted">Phone or email</label>
                <Input
                  placeholder="admin@shiftly.in"
                  value={values.phoneOrEmail}
                  onChange={(event) => setValues((current) => ({ ...current, phoneOrEmail: event.target.value }))}
                />
                {errors.phoneOrEmail && <p className="mt-2 text-xs text-destructive">{errors.phoneOrEmail}</p>}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-muted">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                  <Input
                    className="pl-10"
                    type="password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
                  />
                </div>
                {errors.password && <p className="mt-2 text-xs text-destructive">{errors.password}</p>}
              </div>
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                Sign in
                <ArrowRight size={16} />
              </Button>
              {submitError && <p className="text-sm text-destructive">{submitError}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
