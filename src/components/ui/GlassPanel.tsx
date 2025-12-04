import { cn } from "@/lib/utils";
import React from "react";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  variant?: "default" | "card" | "dark";
  hoverEffect?: boolean;
  gradientBorder?: boolean;
}

export function GlassPanel({
  children,
  className,
  variant = "default",
  hoverEffect = false,
  gradientBorder = false,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300 ease-out",
        {
          "glass": variant === "default",
          "glass-card": variant === "card",
          "glass-dark": variant === "dark",
          "hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(16,45,99,0.4),0_12px_40px_rgba(16,45,99,0.25)]": hoverEffect,
          "relative before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-orange-400/50 before:via-pink-400/30 before:to-purple-400/50 before:-z-10": gradientBorder,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
