"use client"

import React from "react"
import { Line3DChart } from "@devstool/shadcn-echarts"
import type { Line3DChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { Line3DChartProps }

export function Line3DChartComponent(props: Line3DChartProps) {
  return (
    <Line3DChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
