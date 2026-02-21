"use client"

import React from "react"
import { AreaChart } from "@devstool/shadcn-echarts"
import type { AreaChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"

export type { AreaChartProps }

export function AreaChartComponent(props: AreaChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return <AreaChart {...props} option={option} animateOnMount={false} />
}
