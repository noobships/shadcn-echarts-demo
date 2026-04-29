"use client"

import React from "react"
import { SunburstChart } from "@devstool/shadcn-echarts"
import type { SunburstChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

export type { SunburstChartProps }

export function SunburstChartComponent(props: SunburstChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <SunburstChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
    />
  )
}
