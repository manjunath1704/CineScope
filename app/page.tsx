import type { Metadata } from "next"

import { MovieGrid } from "@/components/movies/movie-grid"
import { SearchBar } from "@/components/movies/search-bar"
import { getPopularMovies, searchMovies } from "@/lib/tmdb"

type HomePageProps = {
  searchParams: Promise<{
    q?: string
  }>
}

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover popular movies, search titles, and open detailed movie pages with trailers, cast, and recommendations.",
  openGraph: {
    title: "CineScope - Discover Movies",
    description:
      "Discover popular movies, search titles, and open detailed movie pages with trailers, cast, and recommendations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CineScope - Discover Movies",
    description:
      "Discover popular movies, search titles, and open detailed movie pages with trailers, cast, and recommendations.",
  },
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const query = params.q?.trim() || ""

  const response = query ? await searchMovies(query) : await getPopularMovies()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">CineScope</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Movie Details App</h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Built with Next.js SSR + TMDB API. Search for movies and open full details pages.
        </p>
      </header>

      <SearchBar initialQuery={query} />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>{query ? `Search results for: ${query}` : "Popular movies"}</p>
        <p>{response.total_results} total results</p>
      </div>

      <MovieGrid movies={response.results} />
    </main>
  )
}
