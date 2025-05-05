"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Collection, ApiCollection, MediaItem } from "./types"
import { collectionsAPI, mediaAPI } from "./api"
import { toast } from "@/hooks/use-toast"

type CollectionsContextType = {
  collections: Collection[]
  loading: boolean
  error: string | null
  addToCollection: (mediaId: string, collectionId: string) => Promise<void>
  removeFromCollection: (mediaId: string, collectionId: string) => Promise<void>
  createCollection: (name: string) => Promise<string>
  deleteCollection: (id: string) => Promise<void>
  renameCollection: (id: string, newName: string) => Promise<void>
  isInCollection: (mediaId: string, collectionId?: string) => boolean
  reorderCollectionItems: (collectionId: string, startIndex: number, endIndex: number) => Promise<void>
  refreshCollections: () => Promise<void>
}

const CollectionsContext = createContext<CollectionsContextType | undefined>(undefined)

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Преобразование ApiCollection в Collection с полными объектами MediaItem
  const transformApiCollections = async (apiCollections: ApiCollection[]): Promise<Collection[]> => {
    // Собираем все уникальные ID медиа из всех коллекций
    const allMediaIds = Array.from(new Set(apiCollections.flatMap((collection) => collection.items)))
    console.log(allMediaIds)
    // Если нет медиа, возвращаем коллекции с пустыми массивами items
    if (allMediaIds.length === 0) {
      return apiCollections.map((collection) => ({
        ...collection,
        items: [],
      }))
    }

    // Загружаем все медиа за один запрос
    const mediaItems = await mediaAPI.getByIds(allMediaIds)

    // Создаем Map для быстрого доступа к медиа по ID
    const mediaMap = new Map<string, MediaItem>()
    mediaItems.forEach((item) => {
      mediaMap.set(item.id, item)
    })

    // Преобразуем каждую коллекцию
    return apiCollections.map((apiCollection) => {
      // Преобразуем массив ID в массив объектов MediaItem
      const items = apiCollection.items.map((id) => mediaMap.get(id)).filter((item): item is MediaItem => !!item)

      return {
        ...apiCollection,
        items,
      }
    })
  }

  // Загрузка коллекций при инициализации
  const fetchCollections = async () => {
    try {
      setLoading(true)
      setError(null)

      // Получаем коллекции из API (с массивами ID медиа)
      const apiCollections = await collectionsAPI.getAll()

      // Преобразуем в коллекции с полными объектами MediaItem
      const transformedCollections = await transformApiCollections(apiCollections)

      setCollections(transformedCollections)
    } catch (err) {
      console.error("Failed to fetch collections:", err)
      setError("Не удалось загрузить коллекции")
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить коллекции",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  const refreshCollections = async () => {
    return fetchCollections()
  }

  const addToCollection = async (mediaId: string, collectionId: string) => {
    try {
      await collectionsAPI.addItem(collectionId, mediaId)

      // Получаем информацию о медиа
      const mediaItem = await mediaAPI.getById(mediaId)

      // Обновляем локальное состояние
      setCollections((prevCollections) => {
        return prevCollections.map((collection) => {
          if (collection.id === collectionId) {
            return {
              ...collection,
              items: [...collection.items, mediaItem],
              count: collection.count + 1,
            }
          }
          return collection
        })
      })
    } catch (err) {
      console.error("Failed to add item to collection:", err)
      toast({
        title: "Ошибка",
        description: "Не удалось добавить элемент в коллекцию",
        variant: "destructive",
      })
      throw err
    }
  }

  const removeFromCollection = async (mediaId: string, collectionId: string) => {
    try {
      await collectionsAPI.removeItem(collectionId, mediaId)

      // Обновляем локальное состояние
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
    } catch (err) {
      console.error("Failed to remove item from collection:", err)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить элемент из коллекции",
        variant: "destructive",
      })
      throw err
    }
  }

  const createCollection = async (name: string) => {
    try {
      const apiCollection = await collectionsAPI.create(name)

      // Преобразуем ApiCollection в Collection
      const newCollection: Collection = {
        ...apiCollection,
        items: [], // Новая коллекция не содержит элементов
      }

      // Обновляем локальное состояние
      setCollections((prevCollections) => [...prevCollections, newCollection])

      return newCollection.id
    } catch (err) {
      console.error("Failed to create collection:", err)
      toast({
        title: "Ошибка",
        description: "Не удалось создать коллекцию",
        variant: "destructive",
      })
      throw err
    }
  }

  const deleteCollection = async (id: string) => {
    try {
      await collectionsAPI.delete(id)

      // Обновляем локальное состояние
      setCollections((prevCollections) => prevCollections.filter((collection) => collection.id !== id))
    } catch (err) {
      console.error("Failed to delete collection:", err)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить коллекцию",
        variant: "destructive",
      })
      throw err
    }
  }

  const renameCollection = async (id: string, newName: string) => {
    try {
      await collectionsAPI.update(id, { name:newName })

      setCollections((prevCollections) => prevCollections.map(collection => {
        if (collection.id === id) {
          collection.name = newName
        }
        return collection
      }))
    } catch (err) {
      console.error("Failed to update collection name:", err)
      throw err
    }
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

  const reorderCollectionItems = async (collectionId: string, startIndex: number, endIndex: number) => {
    try {
      // Обновляем локальное состояние

      const prevCollections = collections;
      const newCollections = prevCollections.map((collection) => {
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

      const updatedItems = newCollections.find(collection => collection.id === collectionId)?.items.map(item => item.id)

      if (!updatedItems) {
        throw new Error("collection with id not found")
      }

      await collectionsAPI.reorderItems(collectionId, updatedItems)
      setCollections(newCollections)

    } catch (err) {
      console.error("Failed to reorder collection items:", err)
      toast({
        title: "Ошибка",
        description: "Не удалось изменить порядок элементов",
        variant: "destructive",
      })
      throw err
    }
  }

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        loading,
        error,
        addToCollection,
        removeFromCollection,
        createCollection,
        deleteCollection,
        renameCollection,
        isInCollection,
        reorderCollectionItems,
        refreshCollections,
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
