"use client"

import * as React from "react"
import { Check, Type } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const STORAGE_KEY = "geist-font-variant"

type FontVariant = {
  id: string
  label: string
  cssVar: string
  icon: React.ReactNode
}

function PixelIcon({ shape }: { shape: string }) {
  const size = 14
  const common = { width: size, height: size, viewBox: "0 0 16 16", fill: "currentColor" }

  switch (shape) {
    case "square":
      return (
        <svg {...common}>
          <rect x="2" y="2" width="12" height="12" />
        </svg>
      )
    case "grid":
      return (
        <svg {...common}>
          <rect x="1" y="1" width="5" height="5" />
          <rect x="10" y="1" width="5" height="5" />
          <rect x="1" y="10" width="5" height="5" />
          <rect x="10" y="10" width="5" height="5" />
        </svg>
      )
    case "circle":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6" />
        </svg>
      )
    case "triangle":
      return (
        <svg {...common}>
          <polygon points="8,1 15,14 1,14" />
        </svg>
      )
    case "line":
      return (
        <svg {...common}>
          <rect x="1" y="2" width="14" height="2" />
          <rect x="1" y="7" width="14" height="2" />
          <rect x="1" y="12" width="14" height="2" />
        </svg>
      )
    case "sans":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 13L8 3L13 13" />
          <path d="M5 9H11" />
        </svg>
      )
    case "mono":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 13V3L8 10L12 3V13" />
        </svg>
      )
    default:
      return null
  }
}

const PIXEL_VARIANTS: FontVariant[] = [
  { id: "pixel-square", label: "Pixel Square", cssVar: "--font-geist-pixel-square", icon: <PixelIcon shape="square" /> },
  { id: "pixel-grid", label: "Pixel Grid", cssVar: "--font-geist-pixel-grid", icon: <PixelIcon shape="grid" /> },
  { id: "pixel-circle", label: "Pixel Circle", cssVar: "--font-geist-pixel-circle", icon: <PixelIcon shape="circle" /> },
  { id: "pixel-triangle", label: "Pixel Triangle", cssVar: "--font-geist-pixel-triangle", icon: <PixelIcon shape="triangle" /> },
  { id: "pixel-line", label: "Pixel Line", cssVar: "--font-geist-pixel-line", icon: <PixelIcon shape="line" /> },
]

const OTHER_VARIANTS: FontVariant[] = [
  { id: "sans", label: "Geist Sans", cssVar: "--font-geist-sans", icon: <PixelIcon shape="sans" /> },
  { id: "mono", label: "Geist Mono", cssVar: "--font-geist-mono", icon: <PixelIcon shape="mono" /> },
]

const DEFAULT_VARIANT_ID = "sans"
const ALL_VARIANTS = [...PIXEL_VARIANTS, ...OTHER_VARIANTS]

function getVariantById(id: string) {
  return ALL_VARIANTS.find((variant) => variant.id === id)
}

function readInitialVariantId() {
  if (typeof document === "undefined") {
    return DEFAULT_VARIANT_ID
  }

  const fromDataAttribute = document.documentElement.dataset.fontVariant
  if (fromDataAttribute && getVariantById(fromDataAttribute)) {
    return fromDataAttribute
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && getVariantById(stored)) {
      return stored
    }
  } catch {}

  return DEFAULT_VARIANT_ID
}

function applyFont(cssVar: string) {
  document.documentElement.style.setProperty("--font-active", `var(${cssVar})`)
}

export function FontSwitcher() {
  const [active, setActive] = React.useState(readInitialVariantId)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const variantId = readInitialVariantId()
    const variant = getVariantById(variantId) ?? getVariantById(DEFAULT_VARIANT_ID)
    if (variant) {
      setActive(variant.id)
      applyFont(variant.cssVar)
      document.documentElement.dataset.fontVariant = variant.id
    }
    setMounted(true)
  }, [])

  const handleSelect = React.useCallback((variant: FontVariant) => {
    setActive(variant.id)
    applyFont(variant.cssVar)
    document.documentElement.dataset.fontVariant = variant.id
    localStorage.setItem(STORAGE_KEY, variant.id)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-md">
        <Type className="h-4 w-4" />
      </div>
    )
  }

  const activeVariant = getVariantById(active)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 items-center gap-1.5 rounded-md px-2 text-xs hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        <Type className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{activeVariant?.label ?? "Font"}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Pixel Variants
          </DropdownMenuLabel>
          {PIXEL_VARIANTS.map((variant) => (
            <DropdownMenuItem
              key={variant.id}
              onClick={() => handleSelect(variant)}
              className="flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center text-muted-foreground">
                  {variant.icon}
                </span>
                <span
                  className="text-sm"
                  style={{ fontFamily: `var(${variant.cssVar}), monospace` }}
                >
                  {variant.label}
                </span>
              </span>
              {active === variant.id && <Check className="h-3.5 w-3.5 text-foreground" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Standard
          </DropdownMenuLabel>
          {OTHER_VARIANTS.map((variant) => (
            <DropdownMenuItem
              key={variant.id}
              onClick={() => handleSelect(variant)}
              className="flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center text-muted-foreground">
                  {variant.icon}
                </span>
                <span
                  className="text-sm"
                  style={{ fontFamily: `var(${variant.cssVar}), sans-serif` }}
                >
                  {variant.label}
                </span>
              </span>
              {active === variant.id && <Check className="h-3.5 w-3.5 text-foreground" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
