"use client"

import React from "react"
import { GraphGLChart } from "@devstool/shadcn-echarts"
import type { GraphGLChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { GraphGLChartProps }

export function GraphGLChartComponent(props: GraphGLChartProps) {
  return (
    <GraphGLChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
