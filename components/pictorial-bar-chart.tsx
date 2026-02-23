"use client"

import React from "react"
import { PictorialBarChart } from "@devstool/shadcn-echarts"
import type { PictorialBarChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { PictorialBarChartProps }

export function PictorialBarChartComponent(props: PictorialBarChartProps) {
  return (
    <PictorialBarChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
