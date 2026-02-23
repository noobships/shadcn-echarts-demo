# geist - npm

# geist

![TypeScript icon, indicating that this package has built-in type declarations](https://static-production.npmjs.com/4a2a680dfcadf231172b78b1d3beb975.svg "This package contains built-in TypeScript declarations")

1.7.0 • Public • Published 16 days ago

-   [Readme](?activeTab=readme)
-   [Code Beta](?activeTab=code)
-   [0 Dependencies](?activeTab=dependencies)
-   [128 Dependents](?activeTab=dependents)
-   [67 Versions](?activeTab=versions)

[![](https://raw.githubusercontent.com/vercel/geist-font/main/packages/next/images/hero.png)](https://raw.githubusercontent.com/vercel/geist-font/main/packages/next/images/hero.png)

# Geist Sans, Geist Mono & Geist Pixel

[](#geist-sans-geist-mono--geist-pixel)

Geist is a new font family created by [Vercel](https://vercel.com/design) in collaboration with [Basement Studio](https://basement.studio/).

Geist Sans is a sans-serif typeface designed for legibility and simplicity. It is modern, geometric, and based on the principles of classic Swiss typography. It is designed to be used in body copy, headlines, logos, posters, and other large display sizes.

Geist Mono is a monospaced typeface, crafted to be the perfect partner to Geist Sans. It is designed to be used in code editors, diagrams, terminals, and other text-based interfaces where code is rendered.

Geist Pixel is a display typeface family featuring five unique pixel-based variants, each with a distinct visual style. It is designed for decorative use in headlines, logos, and other display contexts where a pixelated aesthetic is desired.

### Installation

[](#installation)

npm install geist

### Using with Next.js

[](#using-with-nextjs)

`GeistSans` is exported from `geist/font/sans`, `GeistMono` can be found in `geist/font/mono`, and Geist Pixel variants are available from `geist/font/pixel`. All are `NextFontWithVariable` instances. You can learn more by [reading the `next/font` docs](https://nextjs.org/docs/app/building-your-application/optimizing/fonts).

#### Geist Pixel Variants

[](#geist-pixel-variants)

Geist Pixel includes five distinct variants, each exported separately:

Export

CSS Variable

Description

`GeistPixelSquare`

`--font-geist-pixel-square`

Square pixel shapes

`GeistPixelGrid`

`--font-geist-pixel-grid`

Grid-based pixel pattern

`GeistPixelCircle`

`--font-geist-pixel-circle`

Circular pixel shapes

`GeistPixelTriangle`

`--font-geist-pixel-triangle`

Triangular pixel shapes

`GeistPixelLine`

`--font-geist-pixel-line`

Line-based pixel pattern

import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel";

#### App Router

[](#app-router)

In `app/layout.js`:

import { GeistSans } from "geist/font/sans";

export default function RootLayout({ children }) {
  return (
    <html lang\="en" className\={GeistSans.className}\>
      <body\>{children}</body\>
    </html\>
  );
}

#### Pages Router

[](#pages-router)

In `pages/_app.js`:

import { GeistSans } from "geist/font/sans";

export default function MyApp({ Component, pageProps }) {
  return (
    <main className\={GeistSans.className}\>
      <Component {...pageProps} />
    </main\>
  );
}

If you're using a version of Next.js that's older than 15, then in `next.config.js` or `next.config.mjs` add:

/\*\* @type {import('next').NextConfig} \*/
const nextConfig = {
  reactStrictMode: true,
+  transpilePackages: \["geist"\],
};

export default nextConfig;

This is required to fix errors like:

-   `TypeError: next_font_local__WEBPACK_IMPORTED_MODULE_0___default(...) is not a function`
-   `SyntaxError: Cannot use import statement outside a module`

#### With Tailwind CSS

[](#with-tailwind-css)

All Geist fonts can be used through CSS variables.

-   `GeistSans`: `--font-geist-sans`
-   `GeistMono`: `--font-geist-mono`
-   `GeistPixelSquare`: `--font-geist-pixel-square`
-   `GeistPixelGrid`: `--font-geist-pixel-grid`
-   `GeistPixelCircle`: `--font-geist-pixel-circle`
-   `GeistPixelTriangle`: `--font-geist-pixel-triangle`
-   `GeistPixelLine`: `--font-geist-pixel-line`

In `app/layout.js`:

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel";

export default function RootLayout({ children }) {
  return (
    <html
      lang\="en"
      className\={\`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}\`}
    \>
      <body\>{children}</body\>
    </html\>
  );
}

##### Tailwind CSS V4

[](#tailwind-css-v4)

Then in `tailwind.css`:

@theme {
  /\* rest of your theme config \*/

  \--font-sans: var(\--font-geist-sans);
  \--font-mono: var(\--font-geist-mono);
  \--font-pixel-square: var(\--font-geist-pixel-square);
  \--font-pixel-grid: var(\--font-geist-pixel-grid);
  \--font-pixel-circle: var(\--font-geist-pixel-circle);
  \--font-pixel-triangle: var(\--font-geist-pixel-triangle);
  \--font-pixel-line: var(\--font-geist-pixel-line);

  /\* rest of your theme config \*/
}

##### Tailwind CSS V3

[](#tailwind-css-v3)

Then in `tailwind.config.js`:

module.exports \= {
  theme: {
    extend: {
      fontFamily: {
        sans: \["var(--font-geist-sans)"\],
        mono: \["var(--font-geist-mono)"\],
        "pixel-square": \["var(--font-geist-pixel-square)"\],
        "pixel-grid": \["var(--font-geist-pixel-grid)"\],
        "pixel-circle": \["var(--font-geist-pixel-circle)"\],
        "pixel-triangle": \["var(--font-geist-pixel-triangle)"\],
        "pixel-line": \["var(--font-geist-pixel-line)"\],
      },
    },
  },
};

### License

[](#license)

The Geist font family is free and open sourced under the [SIL Open Font License](https://github.com/vercel/geist-font/blob/HEAD/packages/next/LICENSE.TXT).

### Inspiration

[](#inspiration)

Geist has been influenced and inspired by the following typefaces: [Inter](https://rsms.me/inter), [Univers](https://www.linotype.com/1567/univers-family.html), [SF Mono](https://developer.apple.com/fonts/), [SF Pro](https://developer.apple.com/fonts/), [Suisse International](https://www.swisstypefaces.com/fonts/suisse/), [ABC Diatype Mono](https://abcdinamo.com/typefaces/diatype), and [ABC Diatype](https://abcdinamo.com/typefaces/diatype). We thank the creators of these typefaces for their craft.

## Readme

### Keywords

-   [geist](/search?q=keywords:geist)
-   [geist mono](/search?q=keywords:"geist mono")
-   [geist sans](/search?q=keywords:"geist sans")
-   [geist pixel](/search?q=keywords:"geist pixel")
-   [vercel font](/search?q=keywords:"vercel font")