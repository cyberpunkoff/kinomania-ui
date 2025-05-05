"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCollections } from "@/lib/collections-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function CollectionsList() {
  const { collections, loading, error } = useCollections()

  if (loading) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Ошибка загрузки коллекций</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Мои подборки</h2>
        <Button variant="outline" asChild>
          <Link href="/collections">Все подборки</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link key={collection.id} href={`/collections/${collection.id}`} className="group">
            <div className="rounded-lg border p-4 transition-colors hover:bg-accent">
              <h3 className="font-medium">{collection.name}</h3>
              <p className="text-sm text-muted-foreground">фильмов и сериалов {collection.items.length}</p>
            </div>
          </Link>
        ))}
        <Link href="/collections?create=true" className="group">
          <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground transition-colors hover:bg-accent">
            <p>+ Создать новую подборку</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
