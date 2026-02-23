"use client"

import React from "react"
import { BoxplotChart } from "@devstool/shadcn-echarts"
import type { BoxplotChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

export type { BoxplotChartProps }

export function BoxplotChartComponent(props: BoxplotChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <BoxplotChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
      animateOnMount={false}
    />
  )
}
