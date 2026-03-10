import { Skeleton } from "@/components/movies/skeleton"

export default function PersonLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-28" />

      <section className="grid gap-8 md:grid-cols-[280px_1fr]">
        <Skeleton className="aspect-[2/3] w-full" />

        <div className="space-y-5">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <div className="grid gap-2 sm:grid-cols-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full sm:col-span-2" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </section>

      <section className="space-y-4">
        <Skeleton className="h-8 w-24" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex gap-4 rounded-xl border border-border bg-card p-3">
              <Skeleton className="h-28 w-20" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
