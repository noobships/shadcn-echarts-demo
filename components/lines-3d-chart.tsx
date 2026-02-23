"use client"

import React from "react"
import { Lines3DChart } from "@devstool/shadcn-echarts"
import type { Lines3DChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { Lines3DChartProps }

export function Lines3DChartComponent(props: Lines3DChartProps) {
  return (
    <Lines3DChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
