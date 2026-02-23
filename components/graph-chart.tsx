"use client"

import React from "react"
import { GraphChart } from "@devstool/shadcn-echarts"
import type { GraphChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

export type { GraphChartProps }

export function GraphChartComponent(props: GraphChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <GraphChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
      animateOnMount={false}
    />
  )
}
