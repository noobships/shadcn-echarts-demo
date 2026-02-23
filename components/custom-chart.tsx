"use client"

import React from "react"
import { CustomChart } from "@devstool/shadcn-echarts"
import type { CustomChartProps } from "@devstool/shadcn-echarts"
import { cn } from "@/lib/utils"

export type { CustomChartProps }

export function CustomChartComponent(props: CustomChartProps) {
  return (
    <CustomChart
      {...props}
      className={cn("[letter-spacing:0em]", (props as { className?: string }).className)}
    />
  )
}
