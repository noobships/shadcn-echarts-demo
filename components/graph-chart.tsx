"use client"

import React from "react"
import { GraphChart } from "@devstool/shadcn-echarts"
import type { GraphChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"

export type { GraphChartProps }

export function GraphChartComponent(props: GraphChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return <GraphChart {...props} option={option} animateOnMount={false} />
}
