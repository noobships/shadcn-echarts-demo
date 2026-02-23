"use client"

import React from "react"
import { FunnelChart } from "@devstool/shadcn-echarts"
import type { FunnelChartProps } from "@devstool/shadcn-echarts"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

export type { FunnelChartProps }

export function FunnelChartComponent(props: FunnelChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <FunnelChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
      animateOnMount={false}
    />
  )
}
