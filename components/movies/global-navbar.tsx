"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { useRef, useTransition } from "react"

export function GlobalNavbar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentQuery = searchParams.get("q") ?? ""

  const handleSearch = (value: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      const trimmed = value.trim()

       if (trimmed.length > 0 && trimmed.length < 2) {
        return
      }

      startTransition(() => {
        if (!trimmed) {
          if (pathname === "/") {
            router.replace("/")
          }
          return
        }

        router.replace(`/?q=${encodeURIComponent(trimmed)}`)
      })
    }, 500)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-lg font-semibold tracking-tight">
          CineScope
        </Link>

        <div className="relative ml-auto w-full max-w-xl">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            defaultValue={currentQuery}
            onChange={(event) => handleSearch(event.currentTarget.value)}
            placeholder="Search movies from any page..."
            className="h-10 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none transition focus:border-primary"
          />
        </div>
      </div>
    </header>
  )
}
