"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

type SearchBarProps = {
  initialQuery?: string
}

export function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmed = query.trim()
    if (!trimmed) {
      router.push("/")
      return
    }

    router.push(`/?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-3">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search movies..."
        className="h-11 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none transition focus:border-primary"
      />
      <button
        type="submit"
        className="h-11 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
      >
        Search
      </button>
    </form>
  )
}
