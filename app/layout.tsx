import { Geist_Mono, Oswald, Source_Sans_3 } from "next/font/google"
import type { Metadata } from "next"
import { Suspense } from "react"

import "./globals.css"
import { GlobalNavbar } from "@/components/movies/global-navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const fontSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontDisplay = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "CineScope",
    template: "%s | CineScope",
  },
  description:
    "CineScope is a TMDB-powered movie explorer with rich movie details, trailers, cast profiles, and recommendations.",
  openGraph: {
    title: "CineScope",
    description:
      "Explore movies, trailers, cast profiles, and recommendations with CineScope.",
    type: "website",
    siteName: "CineScope",
  },
  twitter: {
    card: "summary_large_image",
    title: "CineScope",
    description:
      "Explore movies, trailers, cast profiles, and recommendations with CineScope.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        fontSans.variable,
        fontDisplay.variable,
      )}
    >
      <body>
        <ThemeProvider>
          <Suspense
            fallback={
              <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                  <span className="text-lg font-semibold tracking-tight">
                    CineScope
                  </span>
                </div>
              </header>
            }
          >
            <GlobalNavbar />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
