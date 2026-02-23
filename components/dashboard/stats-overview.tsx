"use client"

import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react"
import { cn } from "@/lib/utils"

interface StatsOverviewProps {
  children: ReactNode
  className?: string
}

const containerClassName =
  "overflow-hidden rounded-xl border bg-card text-card-foreground"

const gridClassName =
  "grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 [&>*:nth-child(n+3)]:sm:max-lg:border-t"

export function StatsOverview({ children, className }: StatsOverviewProps) {
  const items = Children.toArray(children)

  return (
    <section className={cn(containerClassName, className)}>
      <div className={gridClassName}>
        {items.map((child, index) => {
          if (!isValidElement(child)) return child

          return cloneElement(
            child as ReactElement<{
              index?: number
            }>,
            {
              key: child.key ?? `stat-${index}`,
              index,
            }
          )
        })}
      </div>
    </section>
  )
}
