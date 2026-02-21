"use client"

import React from "react"
import { GaugeChart } from "@devstool/shadcn-echarts"
import type { GaugeChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"

export type { GaugeChartProps }

export function GaugeChartComponent(props: GaugeChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return <GaugeChart {...props} option={option} animateOnMount={false} />
}
