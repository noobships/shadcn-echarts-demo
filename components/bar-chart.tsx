"use client"

import React from "react"
import { BarChart } from "@devstool/shadcn-echarts"
import type { BarChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

export type { BarChartProps }

export function BarChartComponent(props: BarChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <BarChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
    />
  )
}
