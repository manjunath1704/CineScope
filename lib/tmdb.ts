const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

export class TmdbHttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "TmdbHttpError"
    this.status = status
  }
}

export class TmdbNetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TmdbNetworkError"
  }
}

type TmdbAuth =
  | { kind: "access-token"; value: string }
  | { kind: "api-key"; value: string }

function getTmdbAuth(): TmdbAuth {
  const accessToken = process.env.TMDB_ACCESS_TOKEN

  if (accessToken) {
    return { kind: "access-token", value: accessToken }
  }

  const apiKey = process.env.TMDB_API_KEY

  if (apiKey) {
    return { kind: "api-key", value: apiKey }
  }

  throw new Error(
    "Missing TMDB credentials. Set TMDB_ACCESS_TOKEN or TMDB_API_KEY in environment variables.",
  )
}

async function tmdbFetch<T>(path: string, query: Record<string, string> = {}) {
  const auth = getTmdbAuth()
  const params = new URLSearchParams({ language: "en-US", ...query })

  if (auth.kind === "api-key") {
    params.set("api_key", auth.value)
  }

  const headers =
    auth.kind === "access-token"
      ? { Authorization: `Bearer ${auth.value}` }
      : undefined

  const url = `${TMDB_BASE_URL}${path}?${params.toString()}`

  let response: Response | null = null
  const retries = 2

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      response = await fetch(url, {
        headers,
        next: { revalidate: 900 },
      })

      if (response.ok) {
        return (await response.json()) as T
      }

      if (response.status !== 429 && response.status < 500) {
        throw new TmdbHttpError(
          response.status,
          `TMDB request failed with status ${response.status}`,
        )
      }
    } catch (error) {
      if (attempt >= retries) {
        if (error instanceof TmdbHttpError) {
          throw error
        }

        throw new TmdbNetworkError("Unable to reach TMDB. Please try again.")
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)))
  }

  if (!response) {
    throw new TmdbNetworkError("Unable to reach TMDB. Please try again.")
  }

  throw new TmdbHttpError(
    response.status,
    `TMDB request failed with status ${response.status}`,
  )
}

export type MovieSummary = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
}

export type MovieListResponse = {
  page: number
  total_pages: number
  total_results: number
  results: MovieSummary[]
}

export type Genre = {
  id: number
  name: string
}

export type MovieDetails = {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  runtime: number | null
  genres: Genre[]
  status: string
  tagline: string
  budget: number
  revenue: number
  popularity: number
  original_language: string
}

export async function getPopularMovies(page = 1) {
  return tmdbFetch<MovieListResponse>("/movie/popular", { page: String(page) })
}

export async function searchMovies(query: string, page = 1) {
  return tmdbFetch<MovieListResponse>("/search/movie", {
    query,
    page: String(page),
    include_adult: "false",
  })
}

export async function getMovieDetails(movieId: number) {
  return tmdbFetch<MovieDetails>(`/movie/${movieId}`)
}

export type MovieCreditsResponse = {
  id: number
  cast: {
    id: number
    name: string
    character: string
    profile_path: string | null
    order: number
  }[]
}

export type MovieVideosResponse = {
  id: number
  results: {
    id: string
    key: string
    name: string
    site: string
    type: string
    official: boolean
    published_at: string
  }[]
}

export async function getMovieCredits(movieId: number) {
  return tmdbFetch<MovieCreditsResponse>(`/movie/${movieId}/credits`)
}

export async function getMovieVideos(movieId: number) {
  return tmdbFetch<MovieVideosResponse>(`/movie/${movieId}/videos`)
}

export async function getMovieRecommendations(movieId: number) {
  return tmdbFetch<MovieListResponse>(`/movie/${movieId}/recommendations`)
}

export type PersonDetails = {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  place_of_birth: string | null
  profile_path: string | null
  known_for_department: string
  popularity: number
}

export type PersonMovieCredits = {
  id: number
  cast: Array<{
    id: number
    title: string
    character: string
    poster_path: string | null
    release_date: string
    vote_average: number
    popularity: number
  }>
}

export async function getPersonDetails(personId: number) {
  return tmdbFetch<PersonDetails>(`/person/${personId}`)
}

export async function getPersonMovieCredits(personId: number) {
  return tmdbFetch<PersonMovieCredits>(`/person/${personId}/movie_credits`)
}

export function getImageUrl(
  path: string | null,
  size: "w185" | "w342" | "w500" | "w780" = "w500",
) {
  if (!path) {
    return null
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}
