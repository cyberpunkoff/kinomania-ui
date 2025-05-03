"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, BookmarkPlus, Check, Star } from "lucide-react"
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

interface MovieListItemProps {
  item: MediaItem
}

export default function MovieListItem({ item }: MovieListItemProps) {
  const { isInCollection } = useCollections()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isWatched, setIsWatched] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const isAdded = isInCollection(item.id)

  const handleMarkAsWatched = () => {
    setIsWatched(!isWatched)
    toast({
      title: isWatched ? "Отметка снята" : "Отмечено как просмотренное",
      description: isWatched
        ? `"${item.title}" больше не отмечено как просмотренное`
        : `"${item.title}" отмечено как просмотренное`,
    })
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

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <Link href={`/media/${item.id}`} className="sm:w-[150px] md:w-[180px]">
          <div className="relative aspect-[2/3] w-full overflow-hidden">
            <Image
              src={item.poster || "/placeholder.svg"}
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

            <Button variant={isWatched ? "default" : "outline"} size="sm" onClick={handleMarkAsWatched}>
              <Check className="mr-2 h-4 w-4" />
              {isWatched ? "Просмотрено" : "Отметить как просмотренное"}
            </Button>

            <Button variant={isSubscribed ? "default" : "outline"} size="sm" onClick={handleSubscribe}>
              <Bell className="mr-2 h-4 w-4" />
              {isSubscribed ? "Подписка оформлена" : "Подписаться"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

