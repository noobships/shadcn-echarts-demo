"use client"

import React from "react"
import { AreaChart } from "@devstool/shadcn-echarts"
import type { AreaChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

export type { AreaChartProps }

export function AreaChartComponent(props: AreaChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <AreaChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
      animateOnMount={false}
    />
  )
}
