type BarOrientation = "vertical" | "horizontal"

export const chartMotionDefaults = {
  animation: true,
  animationDuration: 760,
  animationDurationUpdate: 420,
  animationEasing: "cubicOut",
  animationEasingUpdate: "cubicOut",
  animationDelay: (index: number) => Math.min(index * 12, 120),
  animationDelayUpdate: 0,
} as const

export const demoBlueScale = ["#8eb8eb", "#3b82f6", "#1d4ed8"] as const

export function withChartMotionOption<TOption>(option: TOption): TOption {
  if (!option || typeof option !== "object" || Array.isArray(option)) {
    return option
  }

  return {
    ...chartMotionDefaults,
    ...option,
  } as TOption
}

type TooltipMarkerInput = {
  marker?: unknown
  color?: unknown
}

function resolveTooltipColor(color: unknown) {
  if (typeof color === "string" && color.length > 0) {
    return color
  }

  if (color && typeof color === "object" && "colorStops" in color) {
    const maybeStops = (color as { colorStops?: Array<{ color?: unknown }> }).colorStops
    const firstColor = maybeStops?.[0]?.color
    if (typeof firstColor === "string" && firstColor.length > 0) {
      return firstColor
    }
  }

  return "currentColor"
}

export function tooltipMarkerHtml(input?: TooltipMarkerInput) {
  if (typeof input?.marker === "string" && input.marker.trim().length > 0) {
    return input.marker
  }

  return `<span style="display:inline-block;width:10px;height:10px;border-radius:9999px;margin-right:6px;background:${resolveTooltipColor(
    input?.color
  )};"></span>`
}

export function tooltipMarkerLabelValue(
  input: TooltipMarkerInput | undefined,
  label: string,
  value: string | number,
  suffix = ""
) {
  return `${tooltipMarkerHtml(input)}${label}: ${value}${suffix}`
}

export function barStartEdgeRadius(
  orientation: BarOrientation,
  radius = 6
): [number, number, number, number] {
  // Keep the existing helper signature but round all bar corners.
  // This makes bar cards consistent across orientations.
  void orientation
  return [radius, radius, radius, radius]
}

export function axisGridPreset(options?: { horizontalBar?: boolean }) {
  if (options?.horizontalBar) {
    return {
      xAxis: {
        splitLine: { show: false },
      },
      yAxis: {
        splitLine: { show: false },
      },
    }
  }

  return {
    xAxis: {
      splitLine: { show: false },
    },
    yAxis: {
      splitLine: {
        show: true,
        lineStyle: {
          type: "solid" as const,
          opacity: 0.22,
        },
      },
    },
  }
}

export function safeSeriesBorderStyle(borderWidth = 1) {
  return {
    borderColor: "transparent",
    borderWidth,
  }
}

export function safeHeatmapEmphasis() {
  return {
    itemStyle: {
      shadowBlur: 8,
      shadowColor: "rgba(59, 130, 246, 0.22)",
    },
  }
}

export function safeGaugeStyle() {
  return {
    progress: {
      show: true,
      width: 16,
      roundCap: true,
    },
    axisLine: {
      roundCap: true,
      lineStyle: { width: 16 },
    },
    itemStyle: {
      borderColor: "transparent",
    },
    detail: {
      valueAnimation: true,
      fontSize: 22,
      fontWeight: 600,
      offsetCenter: [0, "22%"] as [number, string],
    },
  }
}
