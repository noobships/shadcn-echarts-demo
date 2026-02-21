"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function emptifySeriesData(seriesRaw: unknown): unknown {
  const arr = Array.isArray(seriesRaw) ? seriesRaw : [seriesRaw]
  const emptied = arr.map((s) => {
    if (!isPlainObject(s)) return s
    const copy: Record<string, unknown> = { ...s, data: [] }
    if ("links" in copy) copy.links = []
    if ("nodes" in copy) copy.nodes = []
    return copy
  })
  return Array.isArray(seriesRaw) ? emptied : emptied[0]
}

function stripSeries<T>(option: T): T {
  if (!isPlainObject(option)) return option
  const copy = { ...option } as Record<string, unknown>
  if (!("series" in copy)) return copy as T

  if ("radar" in copy || "parallelAxis" in copy) {
    copy.series = emptifySeriesData(copy.series)
    return copy as T
  }

  copy.series = []
  return copy as T
}

/**
 * Returns true only when at least one series contains meaningful data.
 * Radar-style items like `[{ value: [] }]` are treated as empty.
 */
function optionHasSeriesData(option: unknown): boolean {
  if (!isPlainObject(option)) return false
  const series = (option as Record<string, unknown>).series
  if (!series) return false
  const arr = Array.isArray(series) ? series : [series]
  return arr.some((s) => {
    if (!isPlainObject(s)) return false
    const rec = s as Record<string, unknown>

    if (Array.isArray(rec.data) && rec.data.length > 0) {
      const hasReal = rec.data.some((item: unknown) => {
        if (item == null) return false
        if (typeof item !== "object") return true
        if (isPlainObject(item) && Array.isArray((item as Record<string, unknown>).value)) {
          return ((item as Record<string, unknown>).value as unknown[]).length > 0
        }
        if (Array.isArray(item)) return item.length > 0
        return true
      })
      if (hasReal) return true
    }

    if (Array.isArray(rec.links) && rec.links.length > 0) return true
    if (Array.isArray(rec.nodes) && rec.nodes.length > 0) return true
    return false
  })
}

/**
 * Holds chart series stripped until real data arrives, then reveals so
 * ECharts plays the initial entrance animation.
 *
 * Also replays the animation on every theme change by resetting the
 * revealed state — strips series for one frame, then reveals again.
 */
export function useMountAnimation<T>(option: T): T {
  const { resolvedTheme } = useTheme()
  const [revealed, setRevealed] = useState(false)
  const [prevTheme, setPrevTheme] = useState(resolvedTheme)
  const rafRef = useRef(0)
  const hasData = optionHasSeriesData(option)

  // Derived state: reset animation on theme change
  if (resolvedTheme !== prevTheme) {
    setPrevTheme(resolvedTheme)
    if (prevTheme !== undefined && revealed) {
      setRevealed(false)
    }
  }

  useEffect(() => {
    if (revealed || !hasData) return
    rafRef.current = requestAnimationFrame(() => {
      setRevealed(true)
    })
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [hasData, revealed])

  if (revealed) return option
  return stripSeries(option)
}
