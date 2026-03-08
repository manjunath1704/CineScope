"use client"

import { useSyncExternalStore } from "react"

import { StoredMovie, useMovieStore } from "@/lib/store/use-movie-store"

type MovieActionsProps = {
  movie: StoredMovie
}

export function MovieActions({ movie }: MovieActionsProps) {
  const isFavorite = useMovieStore((state) => state.isFavorite)
  const isInWatchlist = useMovieStore((state) => state.isInWatchlist)
  const toggleFavorite = useMovieStore((state) => state.toggleFavorite)
  const toggleWatchlist = useMovieStore((state) => state.toggleWatchlist)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const favoriteLabel =
    mounted && isFavorite(movie.id) ? "Remove Favorite" : "Add Favorite"
  const watchlistLabel =
    mounted && isInWatchlist(movie.id) ? "Remove Watchlist" : "Add Watchlist"

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => toggleFavorite(movie)}
        className="rounded-md border border-border px-3 py-2 text-xs font-medium"
      >
        {favoriteLabel}
      </button>
      <button
        type="button"
        onClick={() => toggleWatchlist(movie)}
        className="rounded-md border border-border px-3 py-2 text-xs font-medium"
      >
        {watchlistLabel}
      </button>
    </div>
  )
}
