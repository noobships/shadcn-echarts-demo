"use client"

import React from "react"
import { ThemeRiverChart } from "@devstool/shadcn-echarts"
import type { ThemeRiverChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { ThemeRiverChartProps }

export function ThemeRiverChartComponent(props: ThemeRiverChartProps) {
  return (
    <ThemeRiverChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
