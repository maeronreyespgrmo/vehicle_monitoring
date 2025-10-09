import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
  iconColor?: string
  className?: string
}

export function MetricCard({ icon, value, label, iconColor, className }: MetricCardProps) {
  return (
    <Card className={cn("shadow-sm border-border/50", className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn("p-2 rounded-lg", iconColor)}>{icon}</div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-card-foreground mb-1">
              {typeof value === "number" ? value.toLocaleString() : value}
            </div>
            <div className="text-sm text-muted-foreground font-medium">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
