"use client"

import React from "react"
import { LineChart } from "@devstool/shadcn-echarts"
import type { LineChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

export type { LineChartProps }

export function LineChartComponent(props: LineChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <LineChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
      animateOnMount={false}
    />
  )
}
