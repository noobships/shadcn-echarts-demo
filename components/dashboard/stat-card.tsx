"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  trend?: number
  trendLabel?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  trend,
  trendLabel,
  icon,
  className,
}: StatCardProps) {
  const TrendIcon = trend && trend > 0 
    ? TrendingUpIcon 
    : trend && trend < 0 
      ? TrendingDownIcon 
      : MinusIcon

  const trendColor = trend && trend > 0 
    ? "text-emerald-600 dark:text-emerald-400" 
    : trend && trend < 0 
      ? "text-red-600 dark:text-red-400" 
      : "text-muted-foreground"

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && (
            <div className="text-muted-foreground/50">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
          {trend !== undefined && (
            <div className={cn("flex items-center gap-0.5 text-sm font-medium", trendColor)}>
              <TrendIcon className="h-4 w-4" />
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        {(description || trendLabel) && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description || trendLabel}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
