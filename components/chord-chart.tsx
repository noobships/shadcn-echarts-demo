"use client"

import React from "react"
import { ChordChart } from "@devstool/shadcn-echarts"
import type { ChordChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { ChordChartProps }

export function ChordChartComponent(props: ChordChartProps) {
  return (
    <ChordChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
