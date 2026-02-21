"use client"

import React from "react"
import { CandlestickChart } from "@devstool/shadcn-echarts"
import type { CandlestickChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"

export type { CandlestickChartProps }

export function CandlestickChartComponent(props: CandlestickChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return <CandlestickChart {...props} option={option} animateOnMount={false} />
}
