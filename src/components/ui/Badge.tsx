import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger" | "outline" | "accent" | "purple"
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "bg-primary/10 text-primary border border-primary/20": variant === "default",
          "bg-slate-100 text-slate-700 border border-slate-200": variant === "secondary",
          "bg-emerald-50 text-emerald-700 border border-emerald-200": variant === "success",
          "bg-amber-50 text-amber-700 border border-amber-200": variant === "warning",
          "bg-rose-50 text-rose-700 border border-rose-200": variant === "danger",
          "bg-accent/15 text-accent border border-accent/30": variant === "accent",
          "bg-purple-50 text-purple-700 border border-purple-200": variant === "purple",
          "border border-slate-300 text-slate-700 bg-transparent": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
