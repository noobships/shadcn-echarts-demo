"use client"

import React from "react"
import { Chart } from "@devstool/shadcn-echarts"
import type { ChartProps } from "@devstool/shadcn-echarts"
import * as echarts from "echarts/core"
import { BarChart, LineChart } from "echarts/charts"
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  PolarComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components"
import { LabelLayout, UniversalTransition } from "echarts/features"
import { CanvasRenderer, SVGRenderer } from "echarts/renderers"
import { withChartMotionOption } from "@/lib/chart-options"
import { useMountAnimation } from "@/hooks/use-mount-animation"
import { cn } from "@/lib/utils"

let registered = false

if (!registered) {
  echarts.use([
    LineChart,
    BarChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    PolarComponent,
    LegendComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer,
    SVGRenderer,
  ])
  registered = true
}

export type ComboChartProps = ChartProps

export function ComboChartComponent(props: ComboChartProps) {
  const option = useMountAnimation(withChartMotionOption(props.option))
  return (
    <Chart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
      option={option}
    />
  )
}
