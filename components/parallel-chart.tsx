"use client"

import React from "react"
import { ParallelChart } from "@devstool/shadcn-echarts"
import type { ParallelChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { ParallelChartProps }

export function ParallelChartComponent(props: ParallelChartProps) {
  return (
    <ParallelChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
