"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Plus, Star, Check } from "lucide-react"
import type { MediaItem } from "@/lib/types"
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

interface MovieCardProps {
  item: MediaItem
}

export default function MovieCard({ item }: MovieCardProps) {
  const { isInCollection } = useCollections()
  const [dialogOpen, setDialogOpen] = useState(false)
  const isAdded = isInCollection(item.id)

  return (
    <Card className="overflow-hidden">
      <Link href={`/media/${item.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={item.poster || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {item.rating}
            </Badge>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/media/${item.id}`} className="hover:underline">
          <h3 className="font-medium line-clamp-1">{item.title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          {item.year} • {item.type === "movie" ? "Фильм" : "Сериал"}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full" disabled={isAdded}>
              {isAdded ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Добавлено
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить
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
      </CardFooter>
    </Card>
  )
}

