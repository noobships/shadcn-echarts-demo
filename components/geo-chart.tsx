"use client"

import React from "react"
import { GeoChart } from "@devstool/shadcn-echarts"
import type { GeoChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { GeoChartProps }

export function GeoChartComponent(props: GeoChartProps) {
  return (
    <GeoChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
