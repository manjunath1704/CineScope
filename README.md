# CineScope - TMDB Movie Details App

Next.js App Router project with server-side rendering (SSR) and Zustand state management, powered by The Movie Database (TMDB) API.

## Features

- SSR movie list on the home page
- Movie search using TMDB `/search/movie`
- Movie details page at `/movie/[id]`
- Zustand persisted store for favorites and watchlist
- Next.js optimized images from TMDB CDN

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add environment variables:

```bash
cp .env.example .env.local
```

Set one of these in `.env.local`:

- `TMDB_ACCESS_TOKEN` (recommended)
- `TMDB_API_KEY`

3. Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Zustand
- Tailwind CSS
