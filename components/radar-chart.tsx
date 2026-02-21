"use client"

import React from "react"
import { RadarChart } from "@devstool/shadcn-echarts"
import type { RadarChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"

export type { RadarChartProps }

export function RadarChartComponent(props: RadarChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return <RadarChart {...props} option={option} animateOnMount={false} />
}
