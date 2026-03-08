import { MovieCard } from "@/components/movies/movie-card"
import { MovieSummary } from "@/lib/tmdb"

type MovieGridProps = {
  movies: MovieSummary[]
}

export function MovieGrid({ movies }: MovieGridProps) {
  if (!movies.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No movies found for this query.
      </div>
    )
  }

  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  )
}
