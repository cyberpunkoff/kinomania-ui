"use client"

import { useMediaList } from "@/hooks/use-media"
import MovieCard from "@/components/movie-card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PopularMediaList() {
  const { mediaList, loading, error } = useMediaList("popular")

  if (loading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-[300px] w-full rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Ошибка загрузки популярных медиа</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Популярное</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mediaList.slice(0, 4).map((media) => (
          <MovieCard key={media.id} item={media} />
        ))}
      </div>
    </div>
  )
}
