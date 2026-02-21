"use client"

import React from "react"
import { ScatterChart } from "@devstool/shadcn-echarts"
import type { ScatterChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"

export type { ScatterChartProps }

export function ScatterChartComponent(props: ScatterChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return <ScatterChart {...props} option={option} animateOnMount={false} />
}
