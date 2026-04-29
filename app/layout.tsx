import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChartProvider } from "@/components/chart-provider";

export const metadata: Metadata = {
  title: "Customer Analytics | shadcn-echarts Demo",
  description: "A beautiful dashboard showcasing shadcn-echarts integration with Next.js and shadcn/ui",
};

const fontVariables = [
  GeistSans.variable,
  GeistMono.variable,
  GeistPixelSquare.variable,
  GeistPixelGrid.variable,
  GeistPixelCircle.variable,
  GeistPixelTriangle.variable,
  GeistPixelLine.variable,
].join(" ");

const fontPreferenceScript = `
(() => {
  try {
    const key = "geist-font-variant";
    const stored = localStorage.getItem(key);
    const fontMap = {
      sans: "--font-geist-sans",
      mono: "--font-geist-mono",
      "pixel-square": "--font-geist-pixel-square",
      "pixel-grid": "--font-geist-pixel-grid",
      "pixel-circle": "--font-geist-pixel-circle",
      "pixel-triangle": "--font-geist-pixel-triangle",
      "pixel-line": "--font-geist-pixel-line",
    };
    const variant = stored && stored in fontMap ? stored : "sans";
    document.documentElement.style.setProperty("--font-active", "var(" + fontMap[variant] + ")");
    document.documentElement.dataset.fontVariant = variant;
  } catch {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={fontVariables}
      data-font-variant="sans"
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: fontPreferenceScript }} />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ChartProvider animateOnMount={false}>
            <TooltipProvider delay={0}>
              {children}
            </TooltipProvider>
          </ChartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
