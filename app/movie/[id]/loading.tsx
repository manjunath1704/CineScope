import { Skeleton } from "@/components/movies/skeleton"

export default function MovieDetailsLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-28" />

      <section className="grid gap-8 md:grid-cols-[300px_1fr]">
        <Skeleton className="aspect-[2/3] w-full" />

        <div className="space-y-5">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-full" />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="aspect-video w-full" />
      </section>

      <section className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-3 text-center">
              <Skeleton className="mx-auto h-20 w-20 rounded-full" />
              <Skeleton className="mx-auto mt-2 h-4 w-3/4" />
              <Skeleton className="mx-auto mt-1 h-3 w-2/3" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
