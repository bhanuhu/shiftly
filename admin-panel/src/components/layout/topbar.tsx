"use client";

import { Bell, LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";

export function Topbar() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/90 px-4 backdrop-blur lg:px-8">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={17} />
        <Input className="pl-10" placeholder="Search bookings, drivers, zones" />
      </div>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell size={18} />
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          document.cookie = "shiftly_admin_token=; path=/; max-age=0; SameSite=Lax";
          logout();
          router.push("/login");
        }}
      >
        <LogOut size={16} />
        Logout
      </Button>
    </header>
  );
}
