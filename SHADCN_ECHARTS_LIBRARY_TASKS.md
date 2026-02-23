# shadcn-echarts Core Tasks (From Demo Findings)

This document lists what should be implemented in the **`shadcn-echarts` library itself** so app/demo projects do not need local workarounds.

## Scope

- Target: `@devstool/shadcn-echarts` core package
- Goal: sensible defaults, no visual/theme glitches, consistent first-load animation behavior
- Non-goal: app-specific chart styling decisions

---

## P0 - Must Ship in Core

## 1) First-load animation should work out of the box

### Problem
- Some charts animate on first render, others appear static depending on mount timing, data loading timing, and option merge behavior.
- Demo needed wrapper-level staging logic to force visible entrance animation.

### What to implement in library
- Add a core feature in `Chart`:
  - `animateOnMount?: boolean` (default: `true`)
  - Optional `animateOnMountDelayMs?: number` (default small, e.g. `0-16`)
- Internal mount strategy:
  - First pass: render an inert frame (same series structure, empty data, no animation)
  - Second pass (next frame): apply full option with animation enabled
- Keep `series.name` and legend shape stable between both passes to avoid legend warnings.
- Ensure behavior works with async-loaded data.

### Acceptance criteria
- All built-in wrappers (`LineChart`, `BarChart`, `PieChart`, `TreemapChart`, etc.) animate on initial visible load by default.
- No “legend series not exists” warnings during mount transitions.
- Can disable with `animateOnMount={false}`.

---

## 2) Theme-safe colors for canvas rendering

### Problem
- Some ECharts style fields do not reliably handle raw CSS var strings (for example `var(--muted-foreground)`) when rendered on canvas.
- This causes inconsistent/ugly text and track colors in dark/light mode in real apps.

### What to implement in library
- Add an option preprocessor that resolves `var(--token)` to computed color values before `setOption`.
- Apply to common color-bearing fields:
  - `itemStyle.color`, `itemStyle.borderColor`
  - `lineStyle.color`, `areaStyle.color`
  - `label.color`, `axisLabel.color`
  - `title.color`, `detail.color` (important for gauge)
  - tooltip text/background where applicable
- Add fallback behavior if token is missing/invalid.

### Acceptance criteria
- Passing CSS vars in options produces correct colors in both dark and light themes.
- No “washed out” or unreadable gauge/label text caused by unresolved var strings.

---

## 3) Treemap default visual seams/background in dark and light mode

### Problem
- Treemap gaps/borders can look muddy or gray, especially in dark mode.
- Hover/emphasis can make seams/background look inconsistent.

### What to implement in library defaults
- Improve treemap defaults in preset:
  - Use seam strategy that does not produce gray artifacts (`gapWidth` and border behavior tuned for both modes).
  - Theme-derived seam/border color instead of static gray.
  - Stable `emphasis.itemStyle` so hover does not switch to ugly seams.

### Acceptance criteria
- Treemap looks clean in both themes without app overrides.
- No obvious gray “dirty background” effect between cells.

---

## 4) ECharts 6 grid warning compatibility

### Problem
- Runtime warning appears in ECharts 6 around `grid.containLabel` and `LegacyGridContainLabel`.

### What to implement in library
- Either:
  - Register `LegacyGridContainLabel` internally when needed, or
  - Migrate preset defaults to modern grid fields (`outerBounds*`) to avoid legacy warning path.
- Prefer modern API where possible.

### Acceptance criteria
- Default charts render without `grid.containLabel` warning spam in console.

---

## P1 - Strongly Recommended

## 5) Public defaults API (reduce custom wrappers)

### What to implement
- Add a top-level defaults config API or provider:
  - animation defaults
  - tooltip defaults
  - preset tuning per chart type
- Example: `setChartDefaults(...)` or `ChartProvider`.

### Benefit
- Teams can tune behavior once without forking wrappers.

---

## 6) Regression tests for the above behaviors

### Add tests for
- `animateOnMount` lifecycle behavior
- CSS var color resolution
- Treemap default seams in dark/light mode
- No mount-time legend warnings
- No `containLabel` warning for default preset

### Suggested test approach
- Unit tests for preprocessors/option transforms
- Integration smoke tests with headless browser screenshot snapshots (light + dark)

---

## Suggested Implementation Order

1. `animateOnMount` in core `Chart`
2. CSS var color resolution preprocessor
3. Treemap default cleanup in preset
4. ECharts 6 grid warning fix
5. Tests + docs + release notes

---

## Release Notes Template (for package changelog)

- Added `animateOnMount` (enabled by default) for consistent first-load chart animations.
- Improved theme handling by resolving CSS var colors safely for canvas-rendered styles.
- Updated treemap defaults for cleaner dark/light visuals and stable hover seams.
- Fixed ECharts 6 compatibility warning related to grid contain-label behavior.

