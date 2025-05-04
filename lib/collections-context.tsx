"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Collection } from "./types"
import { mockCollections } from "./mock-data"

type CollectionsContextType = {
  collections: Collection[]
  addToCollection: (mediaId: string, collectionId: string) => void
  removeFromCollection: (mediaId: string, collectionId: string) => void
  createCollection: (name: string) => string
  deleteCollection: (id: string) => void
  isInCollection: (mediaId: string, collectionId?: string) => boolean
  reorderCollectionItems: (collectionId: string, startIndex: number, endIndex: number) => void
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined)

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([])

  // Инициализация коллекций из мок-данных
  useEffect(() => {
    setCollections(mockCollections)
  }, [])

  const addToCollection = (mediaId: string, collectionId: string) => {
    setCollections((prevCollections) => {
      return prevCollections.map((collection) => {
        if (collection.id === collectionId) {
          // Проверяем, есть ли уже этот медиа-элемент в коллекции
          const isAlreadyInCollection = collection.items.some((item) => item.id === mediaId)

          if (isAlreadyInCollection) {
            return collection
          }

          // Находим медиа-элемент из всех доступных коллекций
          const mediaItem = prevCollections.flatMap((c) => c.items).find((item) => item.id === mediaId)

          if (!mediaItem) {
            console.error(`Media item with id ${mediaId} not found`)
            return collection
          }

          return {
            ...collection,
            items: [...collection.items, mediaItem],
            count: collection.count + 1,
          }
        }
        return collection
      })
    })
  }

  const removeFromCollection = (mediaId: string, collectionId: string) => {
    setCollections((prevCollections) => {
      return prevCollections.map((collection) => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            items: collection.items.filter((item) => item.id !== mediaId),
            count: collection.count - 1,
          }
        }
        return collection
      })
    })
  }

  const createCollection = (name: string) => {
    const newId = `collection-${Date.now()}`

    setCollections((prevCollections) => [
      ...prevCollections,
      {
        id: newId,
        name,
        count: 0,
        items: [],
      },
    ])

    return newId
  }

  const deleteCollection = (id: string) => {
    setCollections((prevCollections) => prevCollections.filter((collection) => collection.id !== id))
  }

  const isInCollection = (mediaId: string, collectionId?: string) => {
    if (collectionId) {
      // Проверяем, есть ли медиа-элемент в конкретной коллекции
      const collection = collections.find((c) => c.id === collectionId)
      return collection ? collection.items.some((item) => item.id === mediaId) : false
    } else {
      // Проверяем, есть ли медиа-элемент в любой коллекции
      return collections.some((collection) => collection.items.some((item) => item.id === mediaId))
    }
  }

  const reorderCollectionItems = (collectionId: string, startIndex: number, endIndex: number) => {
    setCollections((prevCollections) => {
      return prevCollections.map((collection) => {
        if (collection.id === collectionId) {
          const newItems = [...collection.items]
          const [removed] = newItems.splice(startIndex, 1)
          newItems.splice(endIndex, 0, removed)

          return {
            ...collection,
            items: newItems,
          }
        }
        return collection
      })
    })
  }

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        addToCollection,
        removeFromCollection,
        createCollection,
        deleteCollection,
        isInCollection,
        reorderCollectionItems,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  )
}

export function useCollections() {
  const context = useContext(CollectionsContext)
  if (context === undefined) {
    throw new Error("useCollections must be used within a CollectionsProvider")
  }
  return context
}
