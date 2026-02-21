"use client"

import React from "react"
import { BarChart } from "@devstool/shadcn-echarts"
import type { BarChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"

export type { BarChartProps }

export function BarChartComponent(props: BarChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return <BarChart {...props} option={option} animateOnMount={false} />
}
