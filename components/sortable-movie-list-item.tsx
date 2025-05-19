"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, BookmarkPlus, Check, GripVertical, Star, Trash } from "lucide-react"
import type { MediaItem } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { useCollections } from "@/lib/collections-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import CollectionSelector from "./collection-selector"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { useWatchedMedia } from "@/hooks/use-user"
import { Familjen_Grotesk } from "next/font/google"

interface SortableMovieListItemProps {
  item: MediaItem
  index: number
  isActive: boolean
  collectionId: string
  isEditing: boolean
}

export default function SortableMovieListItem({ item, index, isActive, collectionId, isEditing }: SortableMovieListItemProps) {
  const { isInCollection, removeFromCollection } = useCollections()
  const { isWatched, markAsWatched, unmarkAsWatched, refresh } = useWatchedMedia()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const isAdded = isInCollection(item.id)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleMarkAsWatched = async () => {
    if (isWatched(item.id)) {
      unmarkAsWatched(item.id)
    } else {
      markAsWatched(item.id)
    }

    // toast({
    //   title: isWatched(item.id) ? "Отметка снята" : "Отмечено как просмотренное",
    //   description: isWatched(item.id)
    //     ? `"${item.title}" больше не отмечено как просмотренное`
    //     : `"${item.title}" отмечено как просмотренное`,
    // })
  }

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
    toast({
      title: isSubscribed ? "Подписка отменена" : "Подписка оформлена",
      description: isSubscribed
        ? `Вы больше не будете получать уведомления о "${item.title}"`
        : `Вы будете получать уведомления о новых сериях "${item.title}"`,
    })
  }

  const handleRemoveFromCollection = () => {
    removeFromCollection(item.id, collectionId)
    // toast({
    //   title: "Удалено из подборки",
    //   description: `"${item.title}" удалено из подборки`,
    // })
  }

  return (
    <Card ref={setNodeRef} style={style} className={cn("overflow-hidden", isActive && "z-10 shadow-lg")}>
      <div className="flex flex-col sm:flex-row">
        <div className="flex items-center">
          {isEditing && (
            <div
              className="flex items-center justify-center px-4 cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-medium text-sm m-3">
            {index}
          </div>
        </div>
        <Link href={`/media/${item.id}`} className="sm:w-[150px] md:w-[180px]">
          <div className="relative aspect-[2/3] w-full overflow-hidden">
            <Image
              src={item.posterUrl || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
        </Link>
        <div className="flex flex-col flex-1 p-4">
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <Link href={`/media/${item.id}`} className="hover:underline">
                <h3 className="font-medium text-lg">{item.title}</h3>
              </Link>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-primary text-primary" />
                {item.rating}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {item.year} • {item.type === "movie" ? "Фильм" : "Сериал"} • {item.genres.join(", ")}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 md:line-clamp-3">{item.description}</p>

          <div className="mt-auto flex flex-wrap gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant={isAdded ? "default" : "outline"} size="sm">
                  {isAdded ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Добавлено в подборку
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="mr-2 h-4 w-4" />
                      Добавить в подборку
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить в подборку</DialogTitle>
                  <DialogDescription>Выберите подборку или создайте новую</DialogDescription>
                </DialogHeader>
                <CollectionSelector mediaId={item.id} onClose={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>

            <Button variant={isWatched(item.id) ? "default" : "outline"} size="sm" onClick={handleMarkAsWatched}>
              <Check className="mr-2 h-4 w-4" />
              {isWatched(item.id) ? "Просмотрено" : "Отметить как просмотренное"}
            </Button>

            {/* <Button variant={isSubscribed ? "default" : "outline"} size="sm" onClick={handleSubscribe}>
              <Bell className="mr-2 h-4 w-4" />
              {isSubscribed ? "Подписка оформлена" : "Подписаться"}
            </Button> */}

            <Button variant="outline" size="sm" onClick={handleRemoveFromCollection}>
              <Trash className="mr-2 h-4 w-4" />
              Удалить из подборки
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
