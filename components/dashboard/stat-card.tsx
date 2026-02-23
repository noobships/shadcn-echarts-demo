"use client"

import { cn } from "@/lib/utils"
import NumberFlow from "@number-flow/react"
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react"

type NumberFlowFormat = React.ComponentProps<typeof NumberFlow>["format"]

interface StatCardProps {
  title: string
  value: string | number
  valuePrefix?: string
  valueSuffix?: string
  valueFormat?: NumberFlowFormat
  description?: string
  descriptionValue?: number
  descriptionPrefix?: string
  descriptionSuffix?: string
  descriptionFormat?: NumberFlowFormat
  trend?: number
  trendLabel?: string
  icon?: React.ReactNode
  className?: string
  index?: number
}

export function StatCard({
  title,
  value,
  valuePrefix,
  valueSuffix,
  valueFormat,
  description,
  descriptionValue,
  descriptionPrefix,
  descriptionSuffix,
  descriptionFormat,
  trend,
  trendLabel,
  icon,
  className,
  index,
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

  const isNumericValue = typeof value === "number" && Number.isFinite(value)
  const hasDescriptionValue =
    typeof descriptionValue === "number" && Number.isFinite(descriptionValue)
  const hasDescriptionContent = !!description || hasDescriptionValue
  const hasTrend = trend !== undefined
  const showVerticalDividerDesktop = typeof index === "number" && index > 0
  const showVerticalDividerTablet =
    typeof index === "number" && index % 2 === 1
  const trendMagnitude = Math.abs(trend ?? 0)
  const trendFormat: NumberFlowFormat = Number.isInteger(trendMagnitude)
    ? { maximumFractionDigits: 0 }
    : { minimumFractionDigits: 1, maximumFractionDigits: 1 }

  return (
    <article className={cn("relative flex min-h-36 flex-col justify-center p-4 sm:p-5", className)}>
      <div
        aria-hidden="true"
        className={cn(
          "bg-border absolute top-4 bottom-4 left-0 hidden w-px",
          showVerticalDividerTablet && "sm:max-lg:block",
          showVerticalDividerDesktop && "lg:block"
        )}
      />
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className="text-muted-foreground/60 [&_svg]:size-4">{icon}</div>}
      </div>
      <div className="mt-2">
        <p className="text-3xl font-semibold tracking-tight">
          {isNumericValue ? (
            <NumberFlow
              value={value}
              format={
                valueFormat ??
                (Number.isInteger(value)
                  ? { maximumFractionDigits: 0 }
                  : { maximumFractionDigits: 1 })
              }
              prefix={valuePrefix}
              suffix={valueSuffix}
            />
          ) : (
            value
          )}
        </p>
      </div>
      {hasDescriptionContent && (
        <p className="mt-1 text-xs text-muted-foreground">
          {hasDescriptionValue ? (
            <>
              {descriptionPrefix}
              <NumberFlow
                value={descriptionValue}
                format={
                  descriptionFormat ??
                  (Number.isInteger(descriptionValue)
                    ? { maximumFractionDigits: 0 }
                    : { maximumFractionDigits: 1 })
                }
                suffix={descriptionSuffix}
              />
            </>
          ) : (
            description
          )}
        </p>
      )}
      {hasTrend && (
        <div className="mt-1.5 flex items-center gap-1.5 text-sm">
          <span className={cn("flex items-center gap-0.5 font-medium", trendColor)}>
            <TrendIcon className="size-3.5" />
            <NumberFlow
              value={trendMagnitude}
              format={trendFormat}
              suffix="%"
              className="tabular-nums"
            />
          </span>
          {trendLabel && (
            <span className="text-muted-foreground">{trendLabel}</span>
          )}
        </div>
      )}
    </article>
  )
}
