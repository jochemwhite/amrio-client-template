"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    data-slot="input"
    className={cn(
      "flex h-10 w-full rounded-md border border-form-control-border bg-form-control px-3 py-2 text-sm text-form-control-foreground shadow-xs",
      "placeholder:text-form-control-placeholder",
      "hover:border-form-control-border-hover",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-form-control-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-60",
      "read-only:bg-form-control-muted read-only:hover:border-form-control-border",
      "aria-invalid:border-form-error aria-invalid:ring-form-error/40 aria-invalid:focus-visible:ring-form-error",
      "file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-form-control-foreground",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
