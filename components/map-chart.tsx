"use client"

import React from "react"
import { MapChart } from "@devstool/shadcn-echarts"
import type { MapChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { MapChartProps }

export function MapChartComponent(props: MapChartProps) {
  return (
    <MapChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
