import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
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
      className={cn("antialiased", fontMono.variable, "font-sans", fontSans.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
