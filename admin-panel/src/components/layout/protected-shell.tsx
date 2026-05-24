"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";

export function ProtectedShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.accessToken);
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const hasCookie = document.cookie.includes("shiftly_admin_token=");
    const hasStoredAuth = window.localStorage.getItem("shiftly-admin-auth")?.includes("accessToken");
    const isAllowed = Boolean(token || hasCookie || hasStoredAuth);
    setAllowed(isAllowed);
    setReady(true);
    if (!isAllowed) {
      router.replace("/login");
    }
  }, [router, token]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Skeleton className="h-12 w-56" />
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!allowed) return null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-72">
        <Topbar />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
