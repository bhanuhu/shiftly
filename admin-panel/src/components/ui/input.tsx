import { InputHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-10 w-full rounded-md border border-border bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-muted focus:border-accent",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
