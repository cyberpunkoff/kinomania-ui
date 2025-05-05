export type MediaType = "movie" | "series"

export interface MediaItem {
  id: string
  title: string
  posterUrl: string
  posterUrlPreview: string
  year: number
  rating: number
  type: MediaType
  genres: string[]
  description: string
}

export interface ApiCollection {
  id: string
  name: string
  count: number
  items: string[]
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
  notificationsEnabled: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  date: string
  read: boolean
  mediaId?: string
}
