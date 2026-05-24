import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const variants = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
  neutral: "bg-white/10 text-muted",
  accent: "bg-accent/15 text-accent"
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", variants[variant], className)} {...props} />;
}
