"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

type SearchBarProps = {
  initialQuery?: string
}

export function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()
  const lastCommittedQuery = useRef(initialQuery.trim())
  const router = useRouter()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmed = query.trim()

      if (trimmed === lastCommittedQuery.current) {
        return
      }

      lastCommittedQuery.current = trimmed

      startTransition(() => {
        router.replace(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/")
      })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, router, startTransition])

  return (
    <div className="w-full space-y-2">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search movies..."
        className="h-11 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none transition focus:border-primary"
      />
      {isPending ? (
        <p className="text-xs text-muted-foreground">Searching...</p>
      ) : null}
    </div>
  )
}
