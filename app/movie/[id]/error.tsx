"use client"

import Link from "next/link"

type MovieErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MovieError({ reset }: MovieErrorProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-start justify-center gap-4 px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/" className="text-sm text-muted-foreground underline underline-offset-4">
        Back to movies
      </Link>
      <h1 className="text-2xl font-semibold">Could not load movie details</h1>
      <p className="text-sm text-muted-foreground">
        Something went wrong while rendering this movie. Try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md border border-border px-3 py-2 text-sm"
      >
        Retry
      </button>
    </main>
  )
}
