"use client"

import React from "react"
import { BoxplotChart } from "@devstool/shadcn-echarts"
import type { BoxplotChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"

export type { BoxplotChartProps }

export function BoxplotChartComponent(props: BoxplotChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return <BoxplotChart {...props} option={option} animateOnMount={false} />
}
