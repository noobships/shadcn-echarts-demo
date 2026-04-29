"use client"

import React from "react"
import { RadarChart } from "@devstool/shadcn-echarts"
import type { RadarChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

export type { RadarChartProps }

export function RadarChartComponent(props: RadarChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <RadarChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
    />
  )
}
