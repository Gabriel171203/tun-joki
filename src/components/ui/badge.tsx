import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "terracotta" | "emerald" | "navy" | "neutral";
}

export function Badge({ className, variant = "terracotta", children, ...props }: BadgeProps) {
  const variantStyles = {
    terracotta: "bg-terracotta-100 text-terracotta-800 border-terracotta-200",
    emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
    navy: "bg-navy-100 text-navy-800 border-navy-200",
    neutral: "bg-earth-100 text-earth-800 border-earth-200",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
