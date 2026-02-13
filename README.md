# shadcn-echarts Demo

<div align="left">

**Minimal Next.js reference project for developers exploring `@devstool/shadcn-echarts`.**

[![License](https://img.shields.io/badge/License-MIT-white?style=for-the-badge&logo=opensourceinitiative&logoColor=black)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-000000?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![ECharts](https://img.shields.io/badge/Apache_ECharts-000000?style=for-the-badge)](https://echarts.apache.org/)
[![Library Site](https://img.shields.io/badge/Library-shadcn--echarts.devstool.dev-000000?style=for-the-badge)](https://shadcn-echarts.devstool.dev)
[![Demo Site](https://img.shields.io/badge/Demo-shadcn--echarts--demo.devstool.dev-white?style=for-the-badge)](https://shadcn-echarts-demo.devstool.dev)

</div>

This repository is a practical usage demo of [`@devstool/shadcn-echarts`](https://www.npmjs.com/package/@devstool/shadcn-echarts), built with Next.js App Router and TypeScript.

Part of the `devstool` brand, maintained under the `noobships` account.

## Try It Live

- **Library**: [shadcn-echarts.devstool.dev](https://shadcn-echarts.devstool.dev)
- **Demo**: [shadcn-echarts-demo.devstool.dev](https://shadcn-echarts-demo.devstool.dev)

## What This Repo Shows

- Typed chart configuration patterns across multiple chart types
- Dashboard-oriented UI composition with shadcn-style components
- Theme-friendly chart rendering in a real app structure
- A concrete example developers can copy, adapt, and extend

## Stack

- Next.js 16
- TypeScript
- `@devstool/shadcn-echarts` + Apache ECharts
- Tailwind CSS 4

## Quick Start

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm lint:oxlint
pnpm lint:oxlint:strict
```

## Project Layout

```txt
app/                    # Routes and dashboard pages
components/             # Chart wrappers and UI components
lib/                    # Demo data and data shaping utilities
hooks/                  # Client hooks used by dashboard pages
```

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Contact

Built by **[@noobships](https://github.com/noobships)** under the `devstool` brand.

For feedback or issues, open an issue:
`https://github.com/noobships/shadcn-echarts-demo/issues`

## License

MIT. See [`LICENSE`](./LICENSE).
