"use client"

import React from "react"
import { SankeyChart } from "@devstool/shadcn-echarts"
import type { SankeyChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"

export type { SankeyChartProps }

export function SankeyChartComponent(props: SankeyChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return <SankeyChart {...props} option={option} animateOnMount={false} />
}
