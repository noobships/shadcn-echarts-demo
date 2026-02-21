"use client"

import React from "react"
import { HeatmapChart } from "@devstool/shadcn-echarts"
import type { HeatmapChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"

export type { HeatmapChartProps }

export function HeatmapChartComponent(props: HeatmapChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return <HeatmapChart {...props} option={option} animateOnMount={false} />
}
