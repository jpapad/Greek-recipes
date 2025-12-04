import type { Viewport } from 'next'
 
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f97316" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" }
  ],
}
