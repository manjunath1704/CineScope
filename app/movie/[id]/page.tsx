import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { MovieActions } from "@/components/movies/movie-actions"
import {
  getImageUrl,
  getMovieCredits,
  getMovieDetails,
  getMovieRecommendations,
  getMovieVideos,
  TmdbHttpError,
} from "@/lib/tmdb"

type MovieDetailsPageProps = {
  params: Promise<{
    id: string
  }>
}

function summarize(text: string, maxLength = 160) {
  if (!text) {
    return "Explore movie details, cast, trailer, and recommendations on CineScope."
  }

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength - 1).trim()}…`
}

export async function generateMetadata({
  params,
}: MovieDetailsPageProps): Promise<Metadata> {
  const { id } = await params
  const movieId = Number(id)

  if (!Number.isFinite(movieId)) {
    return {
      title: "Movie Not Found",
      description: "The requested movie could not be found.",
    }
  }

  try {
    const movie = await getMovieDetails(movieId)
    const description = summarize(movie.overview)
    const imageUrl =
      getImageUrl(movie.backdrop_path, "w780") ??
      getImageUrl(movie.poster_path, "w500")

    return {
      title: movie.title,
      description,
      openGraph: {
        title: movie.title,
        description,
        type: "video.movie",
        images: imageUrl
          ? [{ url: imageUrl, alt: movie.title }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: movie.title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    }
  } catch {
    return {
      title: "Movie",
      description: "View movie details on CineScope.",
    }
  }
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { id } = await params
  const movieId = Number(id)

  if (!Number.isFinite(movieId)) {
    notFound()
  }

  let movie
  let cast: Awaited<ReturnType<typeof getMovieCredits>>["cast"] = []
  let recommendations: Awaited<
    ReturnType<typeof getMovieRecommendations>
  >["results"] = []
  let trailerKey: string | null = null

  try {
    movie = await getMovieDetails(movieId)
  } catch (error) {
    if (error instanceof TmdbHttpError && error.status === 404) {
      notFound()
    }

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-start justify-center gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-muted-foreground underline underline-offset-4">
          Back to movies
        </Link>
        <h1 className="text-2xl font-semibold">Could not load movie details</h1>
        <p className="text-sm text-muted-foreground">
          TMDB is temporarily unavailable or your network connection dropped. Refresh and try again.
        </p>
      </main>
    )
  }

  const optionalData = await Promise.allSettled([
    getMovieCredits(movieId),
    getMovieVideos(movieId),
    getMovieRecommendations(movieId),
  ])

  const [creditsResult, videosResult, recommendationsResult] = optionalData

  if (creditsResult.status === "fulfilled") {
    cast = creditsResult.value.cast
      .sort((a, b) => a.order - b.order)
      .slice(0, 12)
  }

  if (videosResult.status === "fulfilled") {
    const trailer = videosResult.value.results.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        (video.official || video.name.toLowerCase().includes("official")),
    )

    trailerKey =
      trailer?.key ??
      videosResult.value.results.find(
        (video) => video.site === "YouTube" && video.type === "Trailer",
      )?.key ??
      null
  }

  if (recommendationsResult.status === "fulfilled") {
    recommendations = recommendationsResult.value.results.slice(0, 8)
  }

  const posterUrl = getImageUrl(movie.poster_path, "w500")
  const ratingText =
    typeof movie.vote_average === "number" ? `${movie.vote_average.toFixed(1)}/10` : "N/A"
  const votesText =
    typeof movie.vote_count === "number" ? movie.vote_count.toLocaleString() : "N/A"
  const languageText =
    typeof movie.original_language === "string" && movie.original_language
      ? movie.original_language.toUpperCase()
      : "N/A"
  const popularityText =
    typeof movie.popularity === "number" ? movie.popularity.toFixed(1) : "N/A"

  const formatCurrency = (value: number) => {
    if (!value) {
      return "N/A"
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      

     
      <div>
        <Link href="/" className="text-sm text-muted-foreground underline underline-offset-4">
          Back to movies
        </Link>
      </div>
      <section className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div>
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={movie.title}
              width={500}
              height={750}
              className="w-full rounded-xl border border-border object-cover"
            />
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
              Poster unavailable
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold sm:text-4xl">{movie.title}</h1>
            <p className="text-muted-foreground">{movie.tagline || "No tagline available."}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>Release: {movie.release_date || "Unknown"}</span>
            <span>•</span>
            <span>Runtime: {movie.runtime ? `${movie.runtime} min` : "Unknown"}</span>
            <span>•</span>
            <span>Rating: {ratingText}</span>
            <span>•</span>
            <span>{votesText} votes</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span key={genre.id} className="rounded-full border border-border px-3 py-1 text-xs">
                {genre.name}
              </span>
            ))}
          </div>

          <p className="max-w-3xl leading-7 text-muted-foreground">{movie.overview || "No overview available."}</p>

          <MovieActions
            movie={{
              id: movie.id,
              title: movie.title,
              posterPath: movie.poster_path,
              releaseDate: movie.release_date,
            }}
          />

          <div className="grid gap-3 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground sm:grid-cols-2">
            <p>Status: {movie.status || "Unknown"}</p>
            <p>Original title: {movie.original_title || movie.title}</p>
            <p>Original language: {languageText}</p>
            <p>Popularity score: {popularityText}</p>
            <p>Budget: {formatCurrency(movie.budget)}</p>
            <p>Revenue: {formatCurrency(movie.revenue)}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Trailer</h2>
        {trailerKey ? (
          <div className="overflow-hidden rounded-xl border border-border">
            <iframe
              title={`${movie.title} trailer`}
              src={`https://www.youtube.com/embed/${trailerKey}`}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No trailer available.</p>
        )}
      </section>

    

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Top Cast</h2>
        {cast.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {cast.map((member) => {
              const avatar = getImageUrl(member.profile_path, "w185")

              return (
                <Link
                  key={member.id}
                  href={`/person/${member.id}`}
                  prefetch={false}
                  className="rounded-xl border border-border bg-card p-3 text-center transition hover:opacity-90"
                >
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={member.name}
                      width={185}
                      height={278}
                      className="mx-auto aspect-square w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mx-auto flex aspect-square w-20 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                  <p className="mt-2 line-clamp-1 text-sm font-medium">{member.name}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{member.character || "Unknown role"}</p>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Cast information is not available.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recommended Movies</h2>
        {recommendations.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {recommendations.map((recommendedMovie) => {
              const recommendationPoster = getImageUrl(recommendedMovie.poster_path, "w342")

              return (
                <Link
                  key={recommendedMovie.id}
                  href={`/movie/${recommendedMovie.id}`}
                  prefetch={false}
                  className="overflow-hidden rounded-xl border border-border bg-card transition hover:opacity-90"
                >
                  {recommendationPoster ? (
                    <Image
                      src={recommendationPoster}
                      alt={recommendedMovie.title}
                      width={342}
                      height={513}
                      className="aspect-[2/3] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] items-center justify-center bg-muted text-xs text-muted-foreground">
                      Poster unavailable
                    </div>
                  )}
                  <div className="p-3">
                    <p className="line-clamp-1 text-sm font-medium">{recommendedMovie.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {recommendedMovie.release_date || "Unknown"} •{" "}
                      {typeof recommendedMovie.vote_average === "number"
                        ? `${recommendedMovie.vote_average.toFixed(1)}/10`
                        : "N/A"}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No recommendations available.</p>
        )}
      </section>
    </main>
  )
}
