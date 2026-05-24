"use client";

import {
  Activity,
  BarChart3,
  CreditCard,
  Gauge,
  Headphones,
  Map,
  Settings,
  SlidersHorizontal,
  Truck,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentType } from "react";

import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/drivers", label: "Drivers", icon: Truck },
  { href: "/bookings", label: "Bookings", icon: Activity },
  { href: "/operations/live", label: "Live Ops", icon: Map },
  { href: "/pricing", label: "Pricing", icon: SlidersHorizontal },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/support", label: "Support", icon: Headphones },
  { href: "/settings", label: "Settings", icon: Settings }
];

function Brand() {
  return (
    <Link href="/dashboard" className="mb-8 flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-accent/25 bg-accent/10 text-accent">
        <Users size={22} />
      </div>
      <div className="min-w-0">
        <div className="truncate text-xl font-black tracking-normal text-white">SHIFTLY</div>
        <div className="truncate text-xs font-medium text-muted">Operations Console</div>
      </div>
    </Link>
  );
}

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {nav.map((item) => {
        const Icon = item.icon as ComponentType<{ size?: number }>;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold text-muted transition hover:bg-white/[0.07] hover:text-white",
              active && "border border-accent/20 bg-accent/10 text-accent hover:bg-accent/12 hover:text-accent"
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border bg-background/95 p-5 lg:block">
      <Brand />
      <NavItems />
    </aside>
  );
}

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={cn("fixed inset-0 z-40 lg:hidden", !open && "pointer-events-none")}>
      <button
        aria-label="Close navigation"
        className={cn("absolute inset-0 bg-black/60 transition-opacity", open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
        type="button"
      />
      <aside
        className={cn(
          "absolute inset-y-0 left-0 w-[min(86vw,320px)] border-r border-border bg-background p-5 shadow-2xl transition-transform",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Brand />
        <NavItems onNavigate={onClose} />
      </aside>
    </div>
  );
}
