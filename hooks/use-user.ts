"use client"

import { useState, useEffect } from "react"
import { userAPI } from "@/lib/api"

export function useWatchedMedia() {
  const [watchedIds, setWatchedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWatched = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userAPI.getWatched()
      setWatchedIds(data)
    } catch (err) {
      console.error("Failed to fetch watched media:", err)
      setError("Не удалось загрузить список просмотренных медиа")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWatched()
  }, [])

  const markAsWatched = async (mediaId: string) => {
    try {
      await userAPI.markAsWatched(mediaId)
      setWatchedIds((prev) => [...prev, mediaId])
    } catch (err) {
      console.error("Failed to mark media as watched:", err)
      throw err
    }
  }

  const unmarkAsWatched = async (mediaId: string) => {
    try {
      await userAPI.unmarkAsWatched(mediaId)
      setWatchedIds((prev) => prev.filter((id) => id !== mediaId))
    } catch (err) {
      console.error("Failed to unmark media as watched:", err)
      throw err
    }
  }

  const isWatched = (mediaId: string) => {
    return watchedIds.includes(mediaId)
  }

  return {
    watchedIds,
    loading,
    error,
    markAsWatched,
    unmarkAsWatched,
    isWatched,
    refresh: fetchWatched,
  }
}
