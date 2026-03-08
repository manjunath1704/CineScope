import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import {
  getImageUrl,
  getPersonDetails,
  getPersonMovieCredits,
  TmdbHttpError,
} from "@/lib/tmdb"

type PersonPageProps = {
  params: Promise<{
    id: string
  }>
}

function summarize(text: string, maxLength = 160) {
  if (!text) {
    return "Explore cast biography and movie credits on CineScope."
  }

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength - 1).trim()}…`
}

export async function generateMetadata({
  params,
}: PersonPageProps): Promise<Metadata> {
  const { id } = await params
  const personId = Number(id)

  if (!Number.isFinite(personId)) {
    return {
      title: "Cast Not Found",
      description: "The requested cast profile could not be found.",
    }
  }

  try {
    const person = await getPersonDetails(personId)
    const description = summarize(person.biography)
    const imageUrl = getImageUrl(person.profile_path, "w500")

    return {
      title: person.name,
      description,
      openGraph: {
        title: person.name,
        description,
        type: "profile",
        images: imageUrl
          ? [{ url: imageUrl, alt: person.name }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: person.name,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    }
  } catch {
    return {
      title: "Cast",
      description: "View cast profile details on CineScope.",
    }
  }
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params
  const personId = Number(id)

  if (!Number.isFinite(personId)) {
    notFound()
  }

  let person
  let filmography: Awaited<ReturnType<typeof getPersonMovieCredits>>["cast"] = []

  try {
    const [details, credits] = await Promise.all([
      getPersonDetails(personId),
      getPersonMovieCredits(personId),
    ])

    person = details
    filmography = credits.cast
      .filter((movie) => movie.title)
      .sort((a, b) => {
        const yearA = Number(a.release_date?.slice(0, 4) || 0)
        const yearB = Number(b.release_date?.slice(0, 4) || 0)

        if (yearA !== yearB) {
          return yearB - yearA
        }

        return b.popularity - a.popularity
      })
  } catch (error) {
    if (error instanceof TmdbHttpError && error.status === 404) {
      notFound()
    }

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-start justify-center gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm text-muted-foreground underline underline-offset-4">
          Back to movies
        </Link>
        <h1 className="text-2xl font-semibold">Could not load cast details</h1>
        <p className="text-sm text-muted-foreground">
          TMDB is temporarily unavailable or your network connection dropped. Refresh and try again.
        </p>
      </main>
    )
  }

  const avatar = getImageUrl(person.profile_path, "w500")

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <Link href="/" className="text-sm text-muted-foreground underline underline-offset-4">
          Back to movies
        </Link>
      </div>

      <section className="grid gap-8 md:grid-cols-[280px_1fr]">
        <div>
          {avatar ? (
            <Image
              src={avatar}
              alt={person.name}
              width={500}
              height={750}
              className="w-full rounded-xl border border-border object-cover"
            />
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
              Photo unavailable
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold sm:text-4xl">{person.name}</h1>
            <p className="text-sm text-muted-foreground">
              {person.known_for_department} • Popularity {person.popularity.toFixed(1)}
            </p>
          </div>

          <div className="grid gap-2 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground sm:grid-cols-2">
            <p>Birthday: {person.birthday || "Unknown"}</p>
            <p>Deathday: {person.deathday || "N/A"}</p>
            <p className="sm:col-span-2">Place of birth: {person.place_of_birth || "Unknown"}</p>
          </div>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold">Biography</h2>
            <p className="whitespace-pre-line leading-7 text-muted-foreground">
              {person.biography || "Biography not available."}
            </p>
          </section>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Movies</h2>
        {filmography.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filmography.map((movie) => (
              <Link
                key={`${person.id}-${movie.id}-${movie.character}`}
                href={`/movie/${movie.id}`}
                prefetch={false}
                className="flex gap-4 rounded-xl border border-border bg-card p-3 transition hover:opacity-90"
              >
                {getImageUrl(movie.poster_path, "w185") ? (
                  <Image
                    src={getImageUrl(movie.poster_path, "w185")!}
                    alt={movie.title}
                    width={185}
                    height={278}
                    className="h-28 w-20 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-20 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                    No poster
                  </div>
                )}
                <div className="min-w-0 space-y-1">
                  <p className="line-clamp-1 text-sm font-semibold">{movie.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {movie.release_date || "Unknown date"} • {movie.vote_average.toFixed(1)}/10
                  </p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    Character: {movie.character || "Unknown"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No movie credits available.</p>
        )}
      </section>
    </main>
  )
}
