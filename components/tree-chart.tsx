"use client"

import React from "react"
import { TreeChart } from "@devstool/shadcn-echarts"
import type { TreeChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { TreeChartProps }

export function TreeChartComponent(props: TreeChartProps) {
  return (
    <TreeChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
