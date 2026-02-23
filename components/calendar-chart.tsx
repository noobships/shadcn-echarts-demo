"use client"

import React from "react"
import { CalendarChart } from "@devstool/shadcn-echarts"
import type { CalendarChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { CalendarChartProps }

export function CalendarChartComponent(props: CalendarChartProps) {
  return (
    <CalendarChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
