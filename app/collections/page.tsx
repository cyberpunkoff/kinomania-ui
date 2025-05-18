"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, Plus, Share, Trash } from "lucide-react"
import { useCollections } from "@/lib/collections-context"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { useSearchParams } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"

export default function CollectionsPage() {
  const { collections, createCollection, deleteCollection } = useCollections()
  const searchParams = useSearchParams();
  const shouldCreate = searchParams.get('create') === 'true';
  const [isCreating, setIsCreating] = useState(shouldCreate)
  const [newCollectionName, setNewCollectionName] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null)

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createCollection(newCollectionName)
      setNewCollectionName("")
      setIsCreating(false)
      toast({
        title: "Подборка создана",
        description: `Подборка "${newCollectionName}" успешно создана`,
      })
    }
  }

  const handleDeleteCollection = () => {
    if (collectionToDelete) {
      const collectionName = collections.find((c) => c.id === collectionToDelete)?.name || ""
      deleteCollection(collectionToDelete)
      setCollectionToDelete(null)
      setDeleteDialogOpen(false)
      toast({
        title: "Подборка удалена",
        description: `Подборка "${collectionName}" успешно удалена`,
      })
    }
  }

  const handleShare = (collectionId: string) => {
    const collectionName = collections.find((c) => c.id === collectionId)?.name || ""
    toast({
      title: "Ссылка скопирована",
      description: `Ссылка на подборку "${collectionName}" скопирована в буфер обмена`,
    })
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Мои подборки</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Создать подборку
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Новая подборка</CardTitle>
            <CardDescription>Введите название для новой подборки</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Название подборки"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              autoFocus
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateCollection}>Создать</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Card key={collection.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>{collection.name}</CardTitle>
              <CardDescription>фильмов и сериалов: {collection.items.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-4 overflow-hidden">
                {collection.items.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="h-16 w-12 rounded border flex-shrink-0 bg-muted"
                    style={{
                      backgroundImage: `url(${item.posterUrlPreview})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ))}
                {collection.items.length > 5 && (
                  <div className="flex h-16 w-12 items-center justify-center rounded border bg-muted text-sm font-medium">
                    +{collection.items.length - 5}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/collections/${collection.id}`}>
                  <Film className="mr-2 h-4 w-4" />
                  Открыть
                </Link>
              </Button>
              <div className="flex gap-2">
                {/* <Button variant="outline" size="icon" onClick={() => handleShare(collection.id)}>
                  <Share className="h-4 w-4" />
                </Button> */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCollectionToDelete(collection.id)
                    setDeleteDialogOpen(true)
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Создать новую подборку</CardTitle>
            <CardDescription>Добавляйте фильмы и сериалы в свои подборки</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <Button variant="outline" size="lg" onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Создать подборку
            </Button>
          </CardContent>
        </Card>
      </div>

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
