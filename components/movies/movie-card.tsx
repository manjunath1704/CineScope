import Image from "next/image"
import Link from "next/link"

import { MovieActions } from "@/components/movies/movie-actions"
import { MovieSummary, getImageUrl } from "@/lib/tmdb"

type MovieCardProps = {
  movie: MovieSummary
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getImageUrl(movie.poster_path, "w500")

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-card">
      <Link href={`/movie/${movie.id}`} prefetch={false} className="block">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={movie.title}
            width={500}
            height={750}
            className="aspect-[2/3] w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[2/3] w-full items-center justify-center bg-muted text-sm text-muted-foreground">
            Poster unavailable
          </div>
        )}
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <h2 className="line-clamp-1 text-base font-semibold">{movie.title}</h2>
          <p className="text-xs text-muted-foreground">
            {movie.release_date || "Unknown release"} • {movie.vote_average.toFixed(1)}/10
          </p>
        </div>

        <p className="line-clamp-3 text-sm text-muted-foreground">{movie.overview || "No overview available."}</p>

        <MovieActions
          movie={{
            id: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
            releaseDate: movie.release_date,
          }}
        />
      </div>
    </article>
  )
}
