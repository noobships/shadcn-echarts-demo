"use client"

import React from "react"
import { HeatmapChart } from "@devstool/shadcn-echarts"
import type { HeatmapChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

export type { HeatmapChartProps }

export function HeatmapChartComponent(props: HeatmapChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <HeatmapChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
    />
  )
}
