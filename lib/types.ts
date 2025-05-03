export type MediaType = "movie" | "series"

export interface MediaItem {
  id: string
  title: string
  poster: string
  year: number
  rating: number
  type: MediaType
  genres: string[]
  description: string
}

export interface Collection {
  id: string
  name: string
  count: number
  items: MediaItem[]
}

export interface User {
  id: string
  name: string
  email: string
  collections: Collection[]
}

export interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  mediaId?: string
}

