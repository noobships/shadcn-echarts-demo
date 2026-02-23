"use client"

import React from "react"
import { Globe3DChart } from "@devstool/shadcn-echarts"
import type { Globe3DChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { Globe3DChartProps }

export function Globe3DChartComponent(props: Globe3DChartProps) {
  return (
    <Globe3DChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
