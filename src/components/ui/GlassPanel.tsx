import { cn } from "@/lib/utils";
import React from "react";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  variant?: "default" | "card" | "dark";
  hoverEffect?: boolean;
}

export function GlassPanel({
  children,
  className,
  variant = "default",
  hoverEffect = false,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        {
          "glass": variant === "default",
          "glass-card": variant === "card",
          "glass-dark": variant === "dark",
          "hover:scale-[1.02] hover:shadow-xl": hoverEffect,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
