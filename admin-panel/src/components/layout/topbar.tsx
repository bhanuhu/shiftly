"use client";

import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-background/90 px-3 backdrop-blur sm:gap-4 sm:px-4 lg:px-8">
      <Button variant="ghost" size="icon" aria-label="Open navigation" className="lg:hidden" onClick={onMenuClick}>
        <Menu size={19} />
      </Button>
      <div className="relative min-w-0 flex-1 md:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={17} />
        <Input className="pl-10" placeholder="Search" />
      </div>
      <Button variant="ghost" size="icon" aria-label="Notifications" className="hidden sm:inline-flex">
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
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </header>
  );
}
