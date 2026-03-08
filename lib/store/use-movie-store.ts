"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type StoredMovie = {
  id: number
  title: string
  posterPath: string | null
  releaseDate: string
}

type MovieStore = {
  favorites: StoredMovie[]
  watchlist: StoredMovie[]
  toggleFavorite: (movie: StoredMovie) => void
  toggleWatchlist: (movie: StoredMovie) => void
  isFavorite: (movieId: number) => boolean
  isInWatchlist: (movieId: number) => boolean
}

function toggleMovie(list: StoredMovie[], movie: StoredMovie) {
  const exists = list.some((item) => item.id === movie.id)

  if (exists) {
    return list.filter((item) => item.id !== movie.id)
  }

  return [movie, ...list]
}

export const useMovieStore = create<MovieStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      watchlist: [],
      toggleFavorite: (movie) => {
        set((state) => ({ favorites: toggleMovie(state.favorites, movie) }))
      },
      toggleWatchlist: (movie) => {
        set((state) => ({ watchlist: toggleMovie(state.watchlist, movie) }))
      },
      isFavorite: (movieId) => get().favorites.some((movie) => movie.id === movieId),
      isInWatchlist: (movieId) =>
        get().watchlist.some((movie) => movie.id === movieId),
    }),
    {
      name: "cine-scope-movies",
    },
  ),
)
