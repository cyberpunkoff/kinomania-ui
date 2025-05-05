"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, BookmarkPlus, Check, Share } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import CollectionSelector from "@/components/collection-selector"
import { useState, use } from "react"
import { useCollections } from "@/lib/collections-context"
import { toast } from "@/hooks/use-toast"
import { useMedia } from "@/hooks/use-media"
import { useWatchedMedia } from "@/hooks/use-user"
import { Skeleton } from "@/components/ui/skeleton"

interface MediaPageProps {
  params: Promise<{
    id: string
  }>
}

export default function MediaPage({ params }: MediaPageProps) {
  
  const { id } = use(params)
  const { media, loading, error } = useMedia(id)
  const { isInCollection } = useCollections()
  const { isWatched, markAsWatched, unmarkAsWatched } = useWatchedMedia()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  if (loading) {
    return (
      <div className="container py-6">
        <div className="grid gap-6 md:grid-cols-[300px_1fr] lg:gap-12">
          <Skeleton className="h-[450px] w-[300px] rounded-lg" />
          <div className="space-y-6">
            <div>
              <Skeleton className="h-10 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !media) {
    return (
      <div className="container py-6 text-center">
        <p className="text-destructive text-lg">Ошибка при загрузке информации о медиа</p>
        <p className="text-muted-foreground">{error || "Медиа не найдено"}</p>
        <Button className="mt-4" onClick={() => window.history.back()}>
          Вернуться назад
        </Button>
      </div>
    )
  }

  const isMovie = media.type === "movie"
  const watched = isWatched(media.id)
  const isAdded = isInCollection(media.id)

  const handleMarkAsWatched = async () => {
    try {
      if (watched) {
        await unmarkAsWatched(media.id)
      } else {
        await markAsWatched(media.id)
      }

      toast({
        title: watched ? "Отметка снята" : "Отмечено как просмотренное",
        description: watched
          ? `"${media.title}" больше не отмечено как просмотренное`
          : `"${media.title}" отмечено как просмотренное`,
      })
    } catch (err) {
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус просмотра",
        variant: "destructive",
      })
    }
  }

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
    toast({
      title: isSubscribed ? "Подписка отменена" : "Подписка оформлена",
      description: isSubscribed
        ? `Вы больше не будете получать уведомления о "${media.title}"`
        : `Вы будете получать уведомления о новых сериях "${media.title}"`,
    })
  }

  const handleShare = () => {
    // В реальном приложении здесь был бы код для копирования ссылки
    toast({
      title: "Ссылка скопирована",
      description: "Ссылка на медиа скопирована в буфер обмена",
    })
  }

  return (
    <div className="container py-6">
      <div className="grid gap-6 md:grid-cols-[300px_1fr] lg:gap-12">
        <div className="mx-auto md:mx-0">
          <div className="relative aspect-[2/3] w-[300px] overflow-hidden rounded-lg">
            <Image src={media.posterUrl || "/placeholder.svg"} alt={media.title} fill className="object-cover" priority />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{media.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground">
              <span>{media.year}</span>
              <span>•</span>
              <span>{isMovie ? "Фильм" : "Сериал"}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span>Рейтинг:</span>
                <Badge variant="secondary">{media.rating}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {media.genres.map((genre) => (
              <Badge key={genre} variant="outline">
                {genre}
              </Badge>
            ))}
          </div>

          <p className="text-muted-foreground">{media.description}</p>

          <div className="flex flex-wrap gap-3">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant={isAdded ? "default" : "outline"}>
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
                <CollectionSelector mediaId={media.id} onClose={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>

            <Button variant={watched ? "default" : "outline"} onClick={handleMarkAsWatched}>
              <Check className="mr-2 h-4 w-4" />
              {watched ? "Просмотрено" : "Отметить как просмотренное"}
            </Button>

            {/* <Button variant={isSubscribed ? "default" : "outline"} onClick={handleSubscribe}>
              <Bell className="mr-2 h-4 w-4" />
              {isSubscribed ? "Подписка оформлена" : "Подписаться"}
            </Button> */}

            <Button variant="outline" onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              Поделиться
            </Button>
          </div>

          <Separator />

          {!isMovie && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Сезоны и серии</h2>
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Сезон 1</h3>
                    <div className="grid gap-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between rounded-md border p-2">
                          <div>
                            <span className="font-medium">Серия {i + 1}</span>
                            <p className="text-sm text-muted-foreground">Название серии</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Серия отмечена",
                                description: `Серия ${i + 1} отмечена как просмотренная`,
                              })
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
