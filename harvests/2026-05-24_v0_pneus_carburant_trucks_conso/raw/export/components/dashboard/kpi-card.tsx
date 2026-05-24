"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  cible?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

export function KPICard({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  cible,
  icon,
  variant = "default",
}: KPICardProps) {
  const getDeltaIcon = () => {
    if (delta === undefined) return null;
    if (delta > 0) return <TrendingUp className="h-3 w-3" />;
    if (delta < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getDeltaColor = () => {
    if (delta === undefined) return "";
    if (delta > 0) return "text-status-ok";
    if (delta < 0) return "text-status-danger";
    return "text-muted-foreground";
  };

  const getBorderColor = () => {
    switch (variant) {
      case "success":
        return "border-l-4 border-l-status-ok";
      case "warning":
        return "border-l-4 border-l-status-warning";
      case "danger":
        return "border-l-4 border-l-status-danger";
      default:
        return "border-l-4 border-l-primary";
    }
  };

  return (
    <Card className={`${getBorderColor()} bg-card`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-foreground">
                {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
              </span>
              {unit && (
                <span className="text-sm text-muted-foreground">{unit}</span>
              )}
            </div>
            {(delta !== undefined || cible) && (
              <div className="flex items-center gap-2 text-xs">
                {delta !== undefined && (
                  <span className={`flex items-center gap-0.5 ${getDeltaColor()}`}>
                    {getDeltaIcon()}
                    {Number.isInteger(delta) ? Math.abs(delta) : Math.abs(delta).toFixed(1)}%
                    {deltaLabel && <span className="text-muted-foreground ml-1">{deltaLabel}</span>}
                  </span>
                )}
                {cible && (
                  <span className="text-muted-foreground">
                    Cible: {cible}
                  </span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
