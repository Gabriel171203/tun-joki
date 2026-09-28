import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "emerald";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] motion-reduce:active:scale-100";

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs rounded-xl gap-1.5",
      md: "px-5 py-2.5 text-sm rounded-2xl gap-2",
      lg: "px-7 py-3.5 text-base rounded-2xl gap-2.5 font-semibold",
    };

    const variantStyles = {
      primary:
        "bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-warm hover:shadow-warm-lg focus-visible:ring-terracotta-500 border border-terracotta-600/30",
      secondary:
        "bg-earth-100 hover:bg-earth-200 text-earth-900 border border-earth-500/70 focus-visible:ring-earth-600",
      outline:
        "border-2 border-earth-500 hover:border-terracotta-500 bg-transparent hover:bg-terracotta-50 text-earth-900 hover:text-terracotta-700 focus-visible:ring-terracotta-500",
      ghost:
        "bg-transparent hover:bg-earth-100 text-earth-800 hover:text-earth-950 focus-visible:ring-earth-600",
      emerald:
        "bg-emerald-600 hover:bg-emerald-700 text-white shadow-warm hover:shadow-warm-lg focus-visible:ring-emerald-600 border border-emerald-700/30",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
