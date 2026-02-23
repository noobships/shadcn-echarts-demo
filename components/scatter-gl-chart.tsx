"use client"

import React from "react"
import { ScatterGLChart } from "@devstool/shadcn-echarts"
import type { ScatterGLChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { ScatterGLChartProps }

export function ScatterGLChartComponent(props: ScatterGLChartProps) {
  return (
    <ScatterGLChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
