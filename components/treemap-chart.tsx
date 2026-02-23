"use client"

import React from "react"
import { TreemapChart } from "@devstool/shadcn-echarts"
import type { TreemapChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

export type { TreemapChartProps }

export function TreemapChartComponent(props: TreemapChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <TreemapChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
      animateOnMount={false}
    />
  )
}
