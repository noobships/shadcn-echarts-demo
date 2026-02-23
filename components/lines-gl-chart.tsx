"use client"

import React from "react"
import { LinesGLChart } from "@devstool/shadcn-echarts"
import type { LinesGLChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { LinesGLChartProps }

export function LinesGLChartComponent(props: LinesGLChartProps) {
  return (
    <LinesGLChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
