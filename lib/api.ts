import { getAccessToken } from "@auth0/nextjs-auth0";
import type { MediaItem, ApiCollection, User, Notification } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${await getAccessToken()}`
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })

  if (!response.ok) {
    // Обработка ошибок API
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API error: ${response.status}`)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

// API для работы с медиа
export const mediaAPI = {
  // Получение списка медиа с возможностью фильтрации
  getAll: async (params?: {
    search?: string
    type?: string
    genres?: string[]
    yearFrom?: number
    yearTo?: number
    ratingFrom?: number
    ratingTo?: number
  }) => {
    const queryParams = new URLSearchParams()

    if (params?.search) queryParams.set("search", params.search)
    if (params?.type) queryParams.set("type", params.type)
    if (params?.genres?.length) queryParams.set("genres", params.genres.join(","))
    if (params?.yearFrom) queryParams.set("yearFrom", params.yearFrom.toString())
    if (params?.yearTo) queryParams.set("yearTo", params.yearTo.toString())
    if (params?.ratingFrom !== undefined) queryParams.set("ratingFrom", params.ratingFrom.toString())
    if (params?.ratingTo) queryParams.set("ratingTo", params.ratingTo.toString())

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""
    return fetchAPI<MediaItem[]>(`/media${query}`)
  },

  // Получение конкретного медиа по ID
  getById: async (id: string) => {
    return fetchAPI<MediaItem>(`/media/${id}`)
  },

  getByIds: async (ids: string[]) => {
    if (!ids.length) return []
    return fetchAPI<MediaItem[]>(`/media/batch?ids=${ids.join(",")}`)
  },

  // Получение популярных медиа
  getPopular: async () => {
    return fetchAPI<MediaItem[]>("/media/popular")
  },

  // Получение новинок
  getNew: async () => {
    return fetchAPI<MediaItem[]>("/media/new")
  },
}

// API для работы с коллекциями
export const collectionsAPI = {
  // Получение всех коллекций пользователя
  getAll: async () => {
    return fetchAPI<ApiCollection[]>("/collections")
  },

  // Получение конкретной коллекции по ID
  getById: async (id: string) => {
    return fetchAPI<ApiCollection>(`/collections/${id}`)
  },

  // Создание новой коллекции
  create: async (name: string) => {
    return fetchAPI<ApiCollection>("/collections", {
      method: "POST",
      body: JSON.stringify({ name }),
    })
  },

  // Обновление коллекции
  update: async (id: string, data: { name?: string }) => {
    return fetchAPI<ApiCollection>(`/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Удаление коллекции
  delete: async (id: string) => {
    return fetchAPI<void>(`/collections/${id}`, {
      method: "DELETE",
    })
  },

  // Добавление медиа в коллекцию
  addItem: async (collectionId: string, mediaId: string) => {
    return fetchAPI<{ success: boolean }>(`/collections/${collectionId}/items`, {
      method: "POST",
      body: JSON.stringify({ mediaId }),
    })
  },

  // Удаление медиа из коллекции
  removeItem: async (collectionId: string, mediaId: string) => {
    return fetchAPI<void>(`/collections/${collectionId}/items/${mediaId}`, {
      method: "DELETE",
    })
  },

  // Изменение порядка элементов в коллекции
  reorderItems: async (collectionId: string, itemIds: string[]) => {
    return fetchAPI<{ success: boolean }>(`/collections/${collectionId}/items/reorder`, {
      method: "PUT",
      body: JSON.stringify({ itemIds }),
    })
  },
}

export const userAPI = {
  // Получение списка просмотренных медиа
  getWatched: async () => {
    return fetchAPI<string[]>("/user/watched")
  },

  // Отметить медиа как просмотренное
  markAsWatched: async (mediaId: string) => {
    return fetchAPI<{ success: boolean }>(`/user/watched/${mediaId}`, {
      method: "POST",
    })
  },

  // Убрать отметку о просмотре
  unmarkAsWatched: async (mediaId: string) => {
    return fetchAPI<{ success: boolean }>(`/user/watched/${mediaId}`, {
      method: "DELETE",
    })
  },
}
