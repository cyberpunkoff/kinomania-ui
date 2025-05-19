"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Edit, Save, Share, Trash } from "lucide-react"
import { useCollections } from "@/lib/collections-context"
import DraggableMovieList from "@/components/draggable-movie-list"
import { toast } from "@/hooks/use-toast"
import { use, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'

interface CollectionPageProps {
  params: Promise<{
    id: string
  }>
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const { collections, loading, createCollection, deleteCollection, renameCollection } = useCollections()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const { id } = use(params); 
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const collection = collections.find((collection) => collection.id === id)
  const router = useRouter()

  const handleDeleteCollection = () => {
    if (collectionToDelete) {
      const collectionName = collections.find((c) => c.id === collectionToDelete)?.name || ""
      deleteCollection(collectionToDelete)
      setCollectionToDelete(null)
      setDeleteDialogOpen(false)
      router.push("/collections")
      // toast({
      //   title: "Подборка удалена",
      //   description: `Подборка "${collectionName}" успешно удалена`,
      // })
    }
  }

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

  if (!collection) {
    notFound()
  }

  const handleEditToggle = () => {
    if (isEditing) {
      if (editedName.trim() && editedName !== collection.name) {
        console.log(`Collection name changed from "${collection.name}" to "${editedName}"`);
        try {
          renameCollection(id, editedName);
        } catch (error) {
          console.error("Error updating collection name:", error);
        }
      }
      setIsEditing(false);
    } else {
      setEditedName(collection.name);
      setIsEditing(true);
    }
  }

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast({
      title: "Ссылка скопирована",
      description: `Ссылка на подборку "${collection.name}" скопирована в буфер обмена. Теперь ей можно поделиться.`,
    })
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {isEditing ? (
            <h1>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-3xl font-bold py-2"
              placeholder="Название коллекции"
              autoFocus
            /></h1>
          ) : (
            <h1 className="text-3xl font-bold">{collection.name}</h1>
          )}
          <p className="text-muted-foreground">{collection.items.length} фильмов и сериалов</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={isEditing ? "default" : "outline"} 
            onClick={handleEditToggle}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Сохранить
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Редактировать
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share className="mr-2 h-4 w-4" />
            Поделиться
          </Button>
          <Button variant="outline" onClick={() => {
                    setCollectionToDelete(collection.id)
                    setDeleteDialogOpen(true)
                  }}>
            <Trash className="mr-2 h-4 w-4" />
            Удалить
          </Button>
        </div>
      </div>

      {collection.items.length > 0 ? (
        <DraggableMovieList 
          collectionId={collection.id} 
          items={collection.items} 
          isEditing={isEditing}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            В этой подборке пока нет фильмов или сериалов. Добавьте их из каталога.
          </p>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удаление подборки</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить эту подборку? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteCollection}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
