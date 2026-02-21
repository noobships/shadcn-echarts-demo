"use client"

import React from "react"
import { FunnelChart } from "@devstool/shadcn-echarts"
import type { FunnelChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"

export type { FunnelChartProps }

export function FunnelChartComponent(props: FunnelChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return <FunnelChart {...props} option={option} animateOnMount={false} />
}
