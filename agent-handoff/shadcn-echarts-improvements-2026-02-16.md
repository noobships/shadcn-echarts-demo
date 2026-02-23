# shadcn-echarts Improvement Status (2026-02-16)

This note is intended for downstream app agents that previously added local workarounds.
Use this to remove only the workarounds that are now covered in `@devstool/shadcn-echarts`.

## Fixed in library

### 1) Stacked bar corner rounding

- Status: fixed in core preset.
- What changed:
  - Bar border radius default now uses fully rounded corners for non-polar bars.
- Source:
  - `src/presets/minimal.ts` (`defaultBarBorderRadius`)
- Action for app workarounds:
  - Remove local stacked-bar borderRadius hacks that were only compensating for non-rounded stack segments.

### 2) First-load chart animation on mount

- Status: fixed in core `Chart`.
- What changed:
  - Added `animateOnMount?: boolean` (default `true`)
  - Added `animateOnMountDelayMs?: number` (default `16`)
  - On first series-based render, `Chart` applies an inert seed frame, then applies the full option after a short delay to ensure visible entrance animation.
- Source:
  - `src/core/types.ts` (`BaseChartProps`)
  - `src/components/chart.tsx` (mount animation staging logic)
- Action for app workarounds:
  - Remove local page-load animation forcing/staging wrappers if they only existed to make first render animate.
  - Keep them only if they implement app-specific choreography beyond chart entrance.

### 3) Sunburst + treemap theme-safe separators

- Status: fixed in core theme + preset defaults.
- What changed:
  - Added theme defaults for `sunburst` and `treemap` with token-derived border/seam colors.
  - Added treemap emphasis seam defaults to prevent harsh hover seams.
  - Minimal preset now also provides token-driven fallback border defaults for these types.
- Source:
  - `src/themes/types.ts`
  - `src/themes/builder.ts`
  - `src/presets/minimal.ts`
- Action for app workarounds:
  - Remove local sunburst/treemap seam/border overrides that only existed for dark-mode parity issues.

### 4) Boxplot contrast defaults

- Status: fixed in core theme + preset defaults.
- What changed:
  - Added contrast-safe boxplot fill + border defaults derived from chart and primary tokens.
- Source:
  - `src/themes/types.ts`
  - `src/themes/builder.ts`
  - `src/presets/minimal.ts`
- Action for app workarounds:
  - Remove basic boxplot fill/stroke contrast patches unless you have chart-specific branding requirements.

### 5) ECharts 6 grid contain-label compatibility

- Status: fixed in core preset and demo polish helper.
- What changed:
  - Replaced default `grid.containLabel` usage with ECharts 6 outer-bounds containment defaults.
- Source:
  - `src/presets/minimal.ts`
  - `demo/src/lib/demo-style-polish.ts`
- Action for app workarounds:
  - Remove local containLabel deprecation workaround patches.

### 6) Tooltip formatter precedence behavior

- Status: fixed in core minimal preset.
- What changed:
  - Preset now avoids injecting a global `tooltip.formatter` when formatting semantics are already defined at top-level or series-level (`formatter`/`valueFormatter`).
  - This prevents accidental override of chart-specific tooltip formatting behavior.
- Source:
  - `src/presets/minimal.ts`
- Action for app workarounds:
  - Remove tooltip precedence workarounds that were only preventing global formatter override behavior.

### 7) Optional option color-token preprocessing

- Status: fixed (opt-in utility added).
- What changed:
  - Added `resolveOptionColorTokens()` utility for resolving token-like color values in custom option trees.
- Source:
  - `src/themes/resolveOptionColorTokens.ts`
  - `src/themes/index.ts`
- Action for app workarounds:
  - Replace custom one-off option-color token walkers with `resolveOptionColorTokens()` where appropriate.

## Not fixed yet (still app-owned if needed)

### A) Example scripts that explicitly disable animation

- Some ECharts upstream examples intentionally set `animation: false` in their own options/scripts.
- The new mount animation behavior does not override explicit `animation: false` from user/example options.
- If your app still sees non-animated charts, check chart-specific options first.

## Migration guidance for downstream agent

1. Remove workaround layers for mount animation, stacked-bar rounding, sunburst/treemap seams, boxplot contrast, and containLabel compatibility.
2. Replace custom tooltip-precedence guards with library defaults (no global formatter injection when custom formatting exists).
3. If your app has custom option token resolvers, migrate to `resolveOptionColorTokens()` where useful.
4. Re-test charts in light and dark mode.
5. If needed, disable new mount animation per chart via `animateOnMount={false}`.

