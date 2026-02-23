"use client"

import React from "react"
import { PieChart } from "@devstool/shadcn-echarts"
import type { PieChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

export type { PieChartProps }

export function PieChartComponent(props: PieChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <PieChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
      animateOnMount={false}
    />
  )
}
