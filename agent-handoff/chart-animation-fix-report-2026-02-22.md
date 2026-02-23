# Chart Animation & Skeleton Fix Report (2026-02-22)

This document catalogues every issue fixed in this session, classifying each as a **library bug** (in `@devstool/shadcn-echarts@0.3.0`) or a **demo project issue** (in the consumer app).

---

## Issue 1: Charts do not animate on first page load

**Classification: Library Bug**

### Symptom

All charts render statically on page load. Switching themes triggers smooth entrance animations, but the initial load never animates.

### Root Cause in Library

The library's `animateOnMount` implementation in `Chart` (v0.3.0) uses a seed-then-merge strategy that is fundamentally broken for most chart types.

**Library source** (`node_modules/@devstool/shadcn-echarts/dist/index.js`, lines 633–653):

```javascript
function createMountSeedOption(option) {
  const seriesList = asArray(optionRecord.series);
  const seededSeries = seriesList.map((series) => {
    const seeded = {
      ...series,
      animation: false,  // ← sets animation:false at SERIES level
      data: []
    };
    return seeded;
  });
  const seededOption = { ...optionRecord, animation: false };
  seededOption.series = restoreArrayOrSingle(seriesInput, seededSeries);
  return seededOption;
}
```

The seed sets `animation: false` on **each individual series object**. After 16ms, the real option is applied via `setChartOption` with `notMerge: false` (merge mode):

```javascript
// line 781
setChartOption(currentChart, currentOption, {
  notMerge: false,   // ← MERGE mode
  lazyUpdate: false
});
```

In ECharts merge mode, series are matched by index. Properties **not explicitly present** in the new series are preserved from the old series. Since the real option's series don't set `animation` at the series level (only at the top level via `chartMotionDefaults`), the seed's `animation: false` persists on each series after the merge. Result: no animation.

Additionally, the seed keeps the series structure (with `data: []`), so ECharts treats the incoming real data as a **data update** within existing series rather than **new series being added**. For line/area charts, data updates don't trigger the clip-reveal entrance animation — only series addition does.

### Why theme switching works

Theme switching triggers a completely separate code path (`chart.setTheme()` + `setChartOption` with `notMerge: true`), which destroys and rebuilds series from scratch, triggering proper initial animations.

### Fix Applied (App-Side Workaround)

Created `hooks/use-mount-animation.ts` — a React-level hook that bypasses the library's broken mechanism entirely:

1. Disables library's `animateOnMount` (`animateOnMount={false}`)
2. Strips `series` to `[]` (not just data) so ECharts has zero series initially
3. Waits for real data + one painted frame, then reveals the full option
4. ECharts sees **new series being added** → plays full initial entrance animation (clip-reveal for lines, grow for bars, expand for pies)

**Files changed:**
- `hooks/use-mount-animation.ts` (new)
- All 16 chart wrapper components in `components/*-chart.tsx` and `components/combo-chart.tsx`

### Recommendation for Library

The `createMountSeedOption` function should strip `series` to `[]` (remove series entirely) rather than keeping series with `animation: false` + `data: []`. When the real option is applied, series should be _added_ (triggering initial animation) not _updated_ (which preserves the seed's `animation: false`). Alternatively, apply the real option with `notMerge: true` instead of `notMerge: false`.

---

## Issue 2: Radar chart crash — `points[idx] is undefined`

**Classification: Library Bug + Demo Project Issue (both)**

### Symptom

Runtime TypeError: `can't access property "push", points[idx] is undefined` when a radar chart receives `radar.indicator: []` (0 indicators) alongside `series[0].data: [{ value: [] }]` (1 data item with empty value array).

### Root Cause

**Library side:** ECharts' radar series renderer assumes `points[idx]` exists for each data item without null-checking against the indicator count. When there are 0 indicators but 1+ data items, `points` is an empty array but the code tries to push into `points[0]`, causing the crash. The library doesn't guard against this inconsistency or document the constraint.

**Demo project side:** Radar chart options were constructed with a literal array wrapper:

```tsx
data: [
  {
    value: domainData.map(d => d.count),  // ← [] when domainData is empty
    name: "Count",
    areaStyle: { opacity: 0.3 },
  },
],
```

When `domainData = []`, this produces `data: [{ value: [] }]` — one data item wrapping an empty value array. This is structurally inconsistent with `radar.indicator: []` (0 indicators).

### Fix Applied

**In `hooks/use-mount-animation.ts`:**

1. `stripSeries` now detects options with `radar` or `parallelAxis` keys and keeps the series structure (ECharts crashes if radar series are removed entirely while indicators exist) — only empties `data` arrays instead
2. `optionHasSeriesData` now inspects radar-style data items (`{ value: [...] }`) and correctly treats `[{ value: [] }]` as "no data"

**In dashboard option construction** (`dashboard-content.tsx`, `geography/regions/page.tsx`):

```tsx
// Before (crashes when domainData is empty):
data: [{ value: domainData.map(d => d.count), name: "Count" }]

// After (safe):
data: domainData.length > 0
  ? [{ value: domainData.map(d => d.count), name: "Count", areaStyle: { opacity: 0.3 } }]
  : []
```

**Files changed:**
- `hooks/use-mount-animation.ts`
- `components/dashboard/dashboard-content.tsx`
- `app/dashboard/geography/regions/page.tsx`

### Recommendation for Library

ECharts (or the library's preset layer) should either:
- Guard against mismatched indicator/data counts in radar series
- Validate and warn when `radar.indicator` is empty but series data is non-empty

---

## Issue 3: Tooltip color indicators missing on some charts

**Classification: Demo Project Issue**

### Symptom

Some chart tooltips showed color indicator dots (swatches) and others didn't, making the UI inconsistent.

### Root Cause

Charts with custom `tooltip.formatter` functions were returning raw strings without the ECharts marker HTML. Only charts using the default formatter (or no custom formatter) showed color indicators.

### Fix Applied

Created reusable helpers in `lib/chart-options.ts`:
- `tooltipMarkerHtml(params)` — extracts the built-in marker or generates a colored dot
- `tooltipMarkerLabelValue(params, label, value, suffix)` — formatted line with marker

Updated all custom tooltip formatters across 8 files to use these helpers, ensuring every chart tooltip includes a color indicator.

**Files changed:**
- `lib/chart-options.ts` (helpers added)
- `app/dashboard/distribution/page.tsx`
- `app/dashboard/customers/page.tsx`
- `app/dashboard/analytics/comparisons/page.tsx`
- `app/dashboard/composition/page.tsx`
- `app/dashboard/geography/page.tsx`
- `app/dashboard/customers/segments/page.tsx`
- `app/dashboard/geography/regions/page.tsx`
- `components/dashboard/dashboard-content.tsx`

---

## Issue 4: Treemap visual artifacts (borders/seams)

**Classification: Demo Project Issue**

### Symptom

Treemap charts showed harsh borders on hover and a background color between boxes that didn't match the app background.

### Root Cause

The demo project had explicit `itemStyle` and `levels` overrides on treemap configurations (e.g., `borderWidth: 3`, `gapWidth: 0`) that conflicted with the library's theme-safe defaults. The library (v0.3.0) already includes token-derived border/seam colors for treemaps (documented in `agent-handoff/shadcn-echarts-improvements-2026-02-16.md`, fix #3).

### Fix Applied

Removed the overriding `itemStyle` and `levels` configs from treemap options, allowing the library's built-in theme-safe defaults to handle seam colors, hover emphasis, and gap styling correctly in both light and dark mode.

**Files changed:**
- `app/dashboard/composition/page.tsx`
- `app/dashboard/geography/page.tsx`
- `components/dashboard/dashboard-content.tsx`

---

## Issue 5: Skeleton loaders instead of chart animations

**Classification: Demo Project Issue**

### Symptom

All dashboard pages showed pulsing skeleton placeholders while data loaded, then charts appeared fully rendered (no entrance animation visible because the `animateOnMount` bug meant charts rendered statically).

### Root Cause

Every page used the pattern:
```tsx
if (isLoading) {
  return <Skeleton />  // ← charts not in DOM yet
}
// compute data
return <Charts />      // ← charts mount after data is ready
```

Charts only mounted after data loaded, missing the opportunity for a zero-to-data entrance animation.

### Fix Applied

Replaced all skeleton loading patterns with always-rendered charts:

1. Removed `if (isLoading) return <Skeleton>` blocks from all 10 pages
2. Data computations guarded with `customers.length > 0` ternaries (empty fallbacks)
3. Charts render immediately with structural options (axes, grid) but no series data
4. When data loads, options update with real series → `useMountAnimation` reveals → ECharts plays entrance animation

This produces the standard SaaS-app pattern: charts appear with axes/structure, then data animates in.

**Files changed:**
- `components/dashboard/dashboard-content.tsx`
- `app/dashboard/trends/page.tsx`
- `app/dashboard/customers/page.tsx`
- `app/dashboard/distribution/page.tsx`
- `app/dashboard/composition/page.tsx`
- `app/dashboard/geography/page.tsx`
- `app/dashboard/geography/regions/page.tsx`
- `app/dashboard/analytics/page.tsx`
- `app/dashboard/analytics/comparisons/page.tsx`
- `app/dashboard/customers/segments/page.tsx`

---

## Issue 6: Charts stop animating after second theme switch

**Classification: Library Bug**

### Symptom

1. Page loads → charts animate (via `useMountAnimation`)
2. Switch theme (e.g., light → dark) → charts animate
3. Switch theme again (e.g., dark → light) → charts **do not animate**

### Root Cause in Library

When the theme changes, **two effects** in the library's `Chart` component fire in sequence:

**Effect 1 — Option effect** (`dist/index.js`, line 761, depends on `autoMode`, `resolvedTheme.mode`):

```javascript
setChartOption(chart, effectiveOption, {
  notMerge: false,   // ← merge mode
  lazyUpdate: false
});
```

**Effect 2 — Theme effect** (`dist/index.js`, line 819, depends on `resolvedTheme.themeName`):

```javascript
if (typeof chart.setTheme === "function") chart.setTheme(nextThemeName);
setChartOption(chart, lastOptionRef.current, {
  notMerge: true,    // ← full replace, should trigger animation
  lazyUpdate: true
});
```

React runs effects in definition order. The option effect fires **first**, applying the new preset-processed option with `notMerge: false` (merge). ECharts updates the chart with new theme colors.

Then the theme effect fires, applying the **same** `lastOptionRef.current` (which was just set by the option effect) with `notMerge: true`. But ECharts has already rendered this exact data from the option effect. The second `setOption` call with identical data gets optimized away — no animation.

On the **first** theme switch, the chart's pre-existing internal state (old theme colors from initial render) is different enough from the new option that ECharts detects meaningful changes. On subsequent switches, the option effect pre-applies everything, leaving nothing new for the theme effect to animate.

### Fix Applied

Extended `useMountAnimation` to track theme via `next-themes`' `useTheme()` hook. When `resolvedTheme` changes:

1. Resets `revealed` to `false` (derived state pattern, compliant with React 19 lint rules)
2. This immediately strips series on re-render
3. On the next animation frame, `revealed` flips to `true`
4. Full option is passed → ECharts sees **new series being added** → entrance animation plays

This produces consistent animation on **every** theme switch, regardless of how many times the user toggles.

**Files changed:**
- `hooks/use-mount-animation.ts`

### Recommendation for Library

The option effect should **not** call `setChartOption` when the only change is `resolvedTheme.mode` / `autoMode` — theme-driven re-renders should be handled exclusively by the theme effect. Alternatively, the theme effect should use a mechanism that guarantees animation even when the data is identical (e.g., briefly setting series to `[]` before re-applying).

---

## Summary Table

| # | Issue | Classification | Root Cause |
|---|-------|---------------|------------|
| 1 | No animation on page load | **Library Bug** | `createMountSeedOption` sets `animation: false` at series level; merge mode preserves it. Seed keeps series with `data: []` → update animation, not initial. |
| 2 | Radar chart crash | **Both** | Library: ECharts doesn't guard radar points against indicator/data mismatch. Demo: option construction produced inconsistent empty state. |
| 3 | Missing tooltip color dots | **Demo Project** | Custom formatters didn't include marker HTML. |
| 4 | Treemap border artifacts | **Demo Project** | Explicit overrides conflicted with library's theme-safe defaults. |
| 5 | Skeleton instead of animation | **Demo Project** | Charts only mounted after data loaded, preventing entrance animation. |
| 6 | No animation on 2nd+ theme switch | **Library Bug** | Option effect pre-applies data with merge before theme effect can `notMerge: true`; ECharts deduplicates the second call. |

---

## Library Version

`@devstool/shadcn-echarts@0.3.0`

## Files Introduced

| File | Purpose |
|------|---------|
| `hooks/use-mount-animation.ts` | React-level mount + theme-switch animation that bypasses the library's broken `animateOnMount` and theme-switch dedup |
| `lib/chart-options.ts` (helpers) | `tooltipMarkerHtml`, `tooltipMarkerLabelValue`, `withChartMotionOption` |
