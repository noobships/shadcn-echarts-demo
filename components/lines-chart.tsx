"use client"

import React from "react"
import { LinesChart } from "@devstool/shadcn-echarts"
import type { LinesChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { LinesChartProps }

export function LinesChartComponent(props: LinesChartProps) {
  return (
    <LinesChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
