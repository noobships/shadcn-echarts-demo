"use client"

import React from "react"
import { MatrixChart } from "@devstool/shadcn-echarts"
import type { MatrixChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { MatrixChartProps }

export function MatrixChartComponent(props: MatrixChartProps) {
  return (
    <MatrixChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
