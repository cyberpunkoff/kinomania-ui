"use client"

import { useState, useEffect } from "react"
import { mediaAPI } from "@/lib/api"
import type { MediaItem } from "@/lib/types"

export function useMedia(id?: string) {
  const [media, setMedia] = useState<MediaItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    const fetchMedia = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await mediaAPI.getById(id)
        setMedia(data)
      } catch (err) {
        console.error("Failed to fetch media:", err)
        setError("Не удалось загрузить информацию о медиа")
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [id])

  return { media, loading, error }
}

export function useMediaList(type?: "popular" | "new") {
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMediaList = async () => {
      try {
        setLoading(true)
        setError(null)

        let data: MediaItem[]

        if (type === "popular") {
          data = await mediaAPI.getPopular()
        } else if (type === "new") {
          data = await mediaAPI.getNew()
        } else {
          data = await mediaAPI.getAll()
        }

        setMediaList(data)
      } catch (err) {
        console.error("Failed to fetch media list:", err)
        setError("Не удалось загрузить список медиа")
      } finally {
        setLoading(false)
      }
    }

    fetchMediaList()
  }, [type])

  return { mediaList, loading, error }
}

export function useMediaSearch() {
  const [results, setResults] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchMedia = async (params: {
    search?: string
    type?: string
    genres?: string[]
    yearFrom?: number
    yearTo?: number
    ratingFrom?: number
    ratingTo?: number
  }) => {
    try {
      setLoading(true)
      setError(null)
      const data = await mediaAPI.getAll(params)
      setResults(data)
      return data
    } catch (err) {
      console.error("Failed to search media:", err)
      setError("Не удалось выполнить поиск")
      return []
    } finally {
      setLoading(false)
    }
  }

  return { results, loading, error, searchMedia }
}
