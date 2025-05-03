"use client"

import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Edit, Share, Trash } from "lucide-react"
import { useCollections } from "@/lib/collections-context"
import DraggableMovieList from "@/components/draggable-movie-list"
import { toast } from "@/hooks/use-toast"

interface CollectionPageProps {
  params: {
    id: string
  }
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const { collections } = useCollections()
  const collection = collections.find((c) => c.id === params.id)

  if (!collection) {
    notFound()
  }

  const handleShare = () => {
    toast({
      title: "Ссылка скопирована",
      description: `Ссылка на подборку "${collection.name}" скопирована в буфер обмена`,
    })
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          <p className="text-muted-foreground">{collection.count} фильмов и сериалов</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Редактировать
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share className="mr-2 h-4 w-4" />
            Поделиться
          </Button>
          <Button variant="outline">
            <Trash className="mr-2 h-4 w-4" />
            Удалить
          </Button>
        </div>
      </div>

      {collection.items.length > 0 ? (
        <DraggableMovieList collectionId={collection.id} items={collection.items} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            В этой подборке пока нет фильмов или сериалов. Добавьте их из каталога.
          </p>
        </div>
      )}
    </div>
  )
}
