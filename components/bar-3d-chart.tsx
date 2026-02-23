"use client"

import React from "react"
import { Bar3DChart } from "@devstool/shadcn-echarts"
import type { Bar3DChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { Bar3DChartProps }

export function Bar3DChartComponent(props: Bar3DChartProps) {
  return (
    <Bar3DChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
