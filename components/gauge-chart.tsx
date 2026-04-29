"use client"

import React from "react"
import { GaugeChart } from "@devstool/shadcn-echarts"
import type { GaugeChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

export type { GaugeChartProps }

export function GaugeChartComponent(props: GaugeChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <GaugeChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
    />
  )
}
