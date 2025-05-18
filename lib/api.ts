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
    // Error handler
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

  getById: async (id: string) => {
    return fetchAPI<MediaItem>(`/media/${id}`)
  },

  getByIds: async (ids: string[]) => {
    if (!ids.length) return []
    return fetchAPI<MediaItem[]>(`/media/batch?ids=${ids.join(",")}`)
  },

  getPopular: async () => {
    return fetchAPI<MediaItem[]>("/media/popular")
  },

  getNew: async () => {
    return fetchAPI<MediaItem[]>("/media/new")
  },
}

// API для работы с коллекциями
export const collectionsAPI = {
  getAll: async () => {
    return fetchAPI<ApiCollection[]>("/collections")
  },

  getById: async (id: string) => {
    return fetchAPI<ApiCollection>(`/collections/${id}`)
  },

  create: async (name: string) => {
    return fetchAPI<ApiCollection>("/collections", {
      method: "POST",
      body: JSON.stringify({ name }),
    })
  },

  update: async (id: string, data: { name?: string }) => {
    return fetchAPI<ApiCollection>(`/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string) => {
    return fetchAPI<void>(`/collections/${id}`, {
      method: "DELETE",
    })
  },

  addItem: async (collectionId: string, mediaId: string) => {
    return fetchAPI<{ success: boolean }>(`/collections/${collectionId}/items`, {
      method: "POST",
      body: JSON.stringify({ mediaId }),
    })
  },

  removeItem: async (collectionId: string, mediaId: string) => {
    return fetchAPI<void>(`/collections/${collectionId}/items/${mediaId}`, {
      method: "DELETE",
    })
  },

  reorderItems: async (collectionId: string, itemIds: string[]) => {
    return fetchAPI<{ success: boolean }>(`/collections/${collectionId}/items/reorder`, {
      method: "PUT",
      body: JSON.stringify({ itemIds }),
    })
  },
}

// API пользователя (списки просмотренного)
export const userAPI = {
  getWatched: async () => {
    return fetchAPI<string[]>("/user/watched")
  },

  markAsWatched: async (mediaId: string) => {
    return fetchAPI<{ success: boolean }>(`/user/watched/${mediaId}`, {
      method: "POST",
    })
  },

  unmarkAsWatched: async (mediaId: string) => {
    return fetchAPI<{ success: boolean }>(`/user/watched/${mediaId}`, {
      method: "DELETE",
    })
  },
}
