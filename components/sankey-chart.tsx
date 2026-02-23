"use client"

import React from "react"
import { SankeyChart } from "@devstool/shadcn-echarts"
import type { SankeyChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

export type { SankeyChartProps }

export function SankeyChartComponent(props: SankeyChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <SankeyChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
      animateOnMount={false}
    />
  )
}
