"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Check } from "lucide-react"
import { useCollections } from "@/lib/collections-context"
import { toast } from "@/hooks/use-toast"

interface CollectionSelectorProps {
  mediaId: string
  onClose?: () => void
}

export default function CollectionSelector({ mediaId, onClose }: CollectionSelectorProps) {
  const { collections, addToCollection, createCollection, isInCollection } = useCollections()
  const [newCollectionName, setNewCollectionName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const handleAddToCollection = (collectionId: string) => {
    addToCollection(mediaId, collectionId)
    //toast({
    //  title: "Добавлено в подборку",
    //  description: "Медиа успешно добавлено в подборку",
    //})
    if (onClose) onClose()
  }

  const handleCreateCollection = async () => {
    if (newCollectionName.trim()) {
      const newCollectionId = await createCollection(newCollectionName)
      addToCollection(mediaId, newCollectionId)
      // toast({
      //   title: "Подборка создана",
      //   description: `Подборка "${newCollectionName}" создана и медиа добавлено`,
      // })
      setNewCollectionName("")
      setIsCreating(false)
      if (onClose) onClose()
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        {collections.map((collection) => {
          const isAdded = isInCollection(mediaId, collection.id)
          return (
            <Button
              key={collection.id}
              variant={isAdded ? "default" : "outline"}
              className="justify-start"
              onClick={() => !isAdded && handleAddToCollection(collection.id)}
              disabled={isAdded}
            >
              {isAdded && <Check className="mr-2 h-4 w-4" />}
              {collection.name}
              <span className="ml-auto text-xs text-muted-foreground">{collection.items.length} шт.</span>
            </Button>
          )
        })}
      </div>

      {isCreating ? (
        <div className="flex gap-2">
          <Input
            placeholder="Название подборки"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            autoFocus
          />
          <Button onClick={handleCreateCollection}>Создать</Button>
        </div>
      ) : (
        <Button variant="outline" className="w-full justify-start" onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Создать новую подборку
        </Button>
      )}
    </div>
  )
}
