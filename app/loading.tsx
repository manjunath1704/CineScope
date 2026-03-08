import { Skeleton } from "@/components/movies/skeleton"

export default function HomeLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </header>

      <div className="flex w-full gap-3">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-24" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <article key={index} className="overflow-hidden rounded-xl border border-border bg-card">
            <Skeleton className="aspect-[2/3] w-full rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-28" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
