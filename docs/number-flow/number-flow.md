# NumberFlow for React - An animated number component

An animated number component. Dependency-free. Accessible. Customizable.

Shuffle[Open sandbox](https://codesandbox.io/p/sandbox/r47dcw)

## Basic usage

```
// Basic usage
import NumberFlow from '@number-flow/react'

<NumberFlow value={123} />
```

`<NumberFlow>` will automatically transition when the `value` prop changes.

## Props

### `format: [Intl.NumberFormatOptions⁠](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options)`

Formatting options for the number.

```
<NumberFlow format={{ notation: 'compact' }} value={value} />
```

### `locales: [Intl.LocalesArgument⁠](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#locales)`

The locale(s) for the number.

### `prefix: string, suffix: string`

A custom prefix or suffix for the number.

Preview

Code

$3/moClickTap anywhere to change numbers

```
<NumberFlow
	value={value}
	format={{ style: 'currency', currency: 'USD', trailingZeroDisplay: 'stripIfInteger' }}
	suffix="/mo"
/>
```

### Timings

There are three props to customize the animation timings. Each accept an [`EffectTiming`⁠](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEffect/getTiming#return_value) object:

Preview

Code

124.23ClickTap anywhere to change numbers

```
<NumberFlow
	// Used for layout-related transforms:
	transformTiming={{ duration: 750, easing: 'linear(...)' }}
	// Used for the digit spin animations.
	// Will fall back to `transformTiming` if unset:
	spinTiming={{ duration: 750, easing: 'linear(...)' }}
	// Used for fading in/out characters:
	opacityTiming={{ duration: 350, easing: 'ease-out' }}
/>
```

For spring-based easings, I’d recommend [Kevin Grajeda’s generator⁠](https://www.kvin.me/css-springs) or [easing.dev⁠](https://www.easing.dev/).

### `trend: number (oldValue: number, value: number) => number` Default: `(oldValue, value) => Math.sign(value - oldValue)`

Controls the direction of the digits. If `trend` is or returns

-   `+1:` the digits always go up.
-   `0:` each digit goes up if it increases and down if it decreases. This can be useful if you want to animate number changes without conveying an overall trend ([example⁠](https://x.com/pontusab/status/1825941664189526067)).
-   `-1:` The digits always go down.

`trend:``default`

20ClickTap anywhere to change numbers

### `isolate: boolean`Default: `false`

If `isolate` is set, `<NumberFlow>`‘s transitions are isolated from any other layout changes that may occur in the same update. Has no effect when inside a [`<NumberFlowGroup>`](#grouping).

`isolate`

42%

ClickTap anywhere to change numbers

### `animated: boolean`Default: `true`

Can be set to `false` to disable all animations and finish any current ones. See the [input example](/examples/#input) for a usage scenario.

### `digits: Record<number, { max?: number }>`

Configure digits based on their position in the number (i.e. for 342.5, the positions are: 324120.5\-1). This can be helpful for time-related displays, to ensure e.g. 59 -> 00. See the [countdown example](/examples/#countdown) for a demo.

`digits` is not reactive to save on bundle size. If you need it to be reactive, please submit a [feature request⁠](https://github.com/barvian/number-flow/discussions/new?category=ideas).

### `respectMotionPreference: boolean`Default: `true`

Can be set to `false` to animate regardless of the user’s reduced motion preference.

### `plugins: Plugin[]`

Plugins to apply to the component. Currently there’s only one plugin, `continuous`, which makes the number transitions appear to pass through in-between numbers:

Preview

Code

`continuous`

120

ClickTap anywhere to change numbers

This plugin has no effect if `trend` is `0`.

### `willChange: boolean`Default: `false`

If set, NumberFlow applies [`will-change` properties⁠](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change) to relevant elements. This can be useful if:

-   Your number is guaranteed to change frequently
-   You experience unwanted repositioning when a transition completes

Note that “excessive use of `will-change` will result in excessive memory use” (source: [MDN⁠](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)).

### `onAnimationsStart: (e: CustomEvent) => void`

Triggered when update animations start. Not to be confused with the built-in `onAnimationStart`, which would trigger for animations on the `<NumberFlow>` element itself.

### `onAnimationsFinish: (e: CustomEvent) => void`

Triggered when update animations finish.

---

## Styling

NumberFlow uses a [custom element⁠](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) under the hood, and exposes [parts⁠](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) for styling purposes:

Preview

Code

$3/moClickTap anywhere to change numbers

You can use your browser’s inspector to see which [`part` attributes⁠](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/part) are available to style. Note that changing the `font-size` of digits is difficult due to the CSS techniques NumberFlow uses.

`::part` styles may cause a flash of unstyled content in [old browsers⁠](https://caniuse.com/declarative-shadow-dom).

See workaround You can use feature detection to apply `::part` styles only to browsers that support [Declarative Shadow DOM⁠](https://web.dev/articles/declarative-shadow-dom) (DSD). Add the following snippet to your `<head>`:

```
<script>
	if (
		HTMLTemplateElement.prototype.hasOwnProperty('shadowRootMode') ||
		HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot') // old Chrome/Edge
	)
		document.documentElement.setAttribute('data-supports-dsd', '')
</script>
```

Then ensure your `::part` styles use it:

```
:root[data-supports-dsd] number-flow-react::part(suffix) {
	font-size: 0.75rem;
}
```

If you’re using Tailwind, you can do this with a custom variant:

```
// tailwind.config.js
import plugin from 'tailwindcss/plugin'

export default {
	// ...
	plugins: [
		plugin(({ matchVariant }) => {
			matchVariant('part', (p) => `:root[data-supports-dsd] &::part(${p})`)
		})
	]
}
```

```
<NumberFlow className="part-[suffix]:text-xs" />
```

There’s also some CSS properties you can use to style the component:

### `--number-flow-mask-[height|width]: <length>`Default: `.25em` | `.5em`

These adjust the height and width of the gradient fade-out masks at the edges of the number. `--number-flow-mask-height` also gets used as the top and bottom padding for the number.

### `--number-flow-char-height: <length>`Default: `1em`

Sets the height of each character. This can be used to adjust the spacing between digits during spin animations.

### `font-variant-numeric: tabular-nums`

Ensures all numbers are the same width, which can prevent digits from shifting during transitions. See [MDN⁠](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric#numeric-spacing-values) for more information.

---

## Grouping

If a `<NumberFlow>` affects another `<NumberFlow>`‘s position, you can wrap them in a `<NumberFlowGroup>` to properly sync their transitions:

Preview

Code

$124.23+5.64%

ClickTap anywhere to change numbers

`<NumberFlowGroup>` doesn’t render an element or accept any props.

---

## Hooks

### `useCanAnimate(opts?: { respectMotionPreference?: boolean }): boolean`

Returns `true` if NumberFlow can animate, i.e. the browser supports the [required features⁠](https://caniuse.com/mdn-css_types_mod) and (optionally) the user is [okay with motion⁠](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion). See the [Motion for React example](/examples#motion-for-react) for a usage scenario.

---

## Limitations

-   [Scientific⁠](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#scientific) and [engineering⁠](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#engineering) notations aren’t supported.
-   [Non-Latin digits⁠](https://github.com/barvian/number-flow/issues/8) and [RTL locales⁠](https://github.com/barvian/number-flow/issues/93) aren’t currently supported.
-   Backgrounds and borders on `<NumberFlow>` won’t scale smoothly during transitions. I’d recommend using [Motion for React⁠](https://motion.dev/docs/react-quick-start) for these, as it’s more composable than any built-in solution could be. See the Motion for React layout animations [example](/examples#motion-for-react).