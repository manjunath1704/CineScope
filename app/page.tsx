import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { MovieGrid } from "@/components/movies/movie-grid"
import { getImageUrl, getPopularMovies, searchMovies } from "@/lib/tmdb"

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

  let response

  try {
    response = query ? await searchMovies(query) : await getPopularMovies()
  } catch {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">CineScope</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Movie Discovery Platform</h1>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            Explore trusted movie data powered by TMDB, including cast, trailers, and detailed title insights.
          </p>
        </header>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Could not load movies</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            TMDB is temporarily unavailable or your network connection dropped. Refresh and try again.
          </p>
          <Link href="/" className="mt-4 inline-block text-sm underline underline-offset-4">
            Retry
          </Link>
        </div>
      </main>
    )
  }

  const featuredMovie = response.results[0]
  const heroBackdrop = getImageUrl(featuredMovie?.backdrop_path, "w780")
  const heroPoster = getImageUrl(featuredMovie?.poster_path, "w342")
  const spotlightMovies = response.results.slice(1, 5)

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      {query ? null : (
        <section className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card shadow-[0_24px_70px_-36px_rgba(31,101,255,0.55)]">
          {heroBackdrop ? (
            <Image
              src={heroBackdrop}
              alt={featuredMovie?.title || "Featured movie"}
              width={1280}
              height={720}
              className="aspect-[21/9] w-full object-cover"
              priority
            />
          ) : (
            <div className="aspect-[21/9] w-full bg-muted" />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[#040915] via-[#071126]/90 to-[#071126]/65" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(131,56,236,0.28),transparent_44%)]" />

          <div className="absolute inset-0 grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_300px] lg:p-10">
            <div className="self-end space-y-4">
              <p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Editor&apos;s Spotlight
              </p>
              <h1 className="max-w-3xl text-4xl font-bold leading-[0.95] text-white sm:text-6xl">
                <span className="hero-title-animated">{featuredMovie?.title || "Cinema Worth Discovering"}</span>
              </h1>
              <p className="max-w-2xl text-base text-slate-200/95">
                {featuredMovie?.overview ||
                  "Discover trending stories, standout performances, and visually rich worlds from across global cinema."}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200/90 sm:text-sm">
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1">
                  {featuredMovie?.release_date || "Release Date N/A"}
                </span>
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1">
                  Rating {typeof featuredMovie?.vote_average === "number" ? featuredMovie.vote_average.toFixed(1) : "N/A"}/10
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={featuredMovie ? `/movie/${featuredMovie.id}` : "/"}
                  prefetch={false}
                  className="rounded-md bg-cyan-300 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                >
                  Open Details
                </Link>
                <a
                  href="#movies"
                  className="rounded-md border border-white/35 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Browse Collection
                </a>
              </div>
            </div>

            <aside className="hidden self-end lg:block">
              <div className="rounded-2xl border border-white/20 bg-black/35 p-3 backdrop-blur-md">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Next Up
                </p>
                <div className="space-y-3">
                  {spotlightMovies.map((movie) => {
                    const poster = getImageUrl(movie.poster_path, "w342")

                    return (
                      <Link
                        key={movie.id}
                        href={`/movie/${movie.id}`}
                        prefetch={false}
                        className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-2 transition hover:bg-white/10"
                      >
                        {poster ? (
                          <Image
                            src={poster}
                            alt={movie.title}
                            width={68}
                            height={102}
                            className="h-16 w-11 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-16 w-11 rounded-md bg-slate-700" />
                        )}
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-sm font-semibold text-white">
                            {movie.title}
                          </p>
                          <p className="text-xs text-slate-300">
                            {movie.release_date || "Unknown"} • {movie.vote_average.toFixed(1)}/10
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </aside>

            {heroPoster ? (
              <div className="absolute bottom-6 right-6 hidden w-28 overflow-hidden rounded-xl border border-white/25 shadow-xl xl:block">
                <Image
                  src={heroPoster}
                  alt={featuredMovie?.title || "Poster"}
                  width={342}
                  height={513}
                  className="aspect-[2/3] w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </section>
      )}

      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">CineScope</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Movie Discovery Platform</h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Explore trusted movie data powered by TMDB, including cast, trailers, and detailed title insights.
        </p>
      </header>

      <div id="movies" className="flex items-center justify-between text-sm text-muted-foreground">
        <p>{query ? `Search results for: ${query}` : "Popular movies"}</p>
        <p>{response.total_results} total results</p>
      </div>

      <MovieGrid movies={response.results} />
    </main>
  )
}
