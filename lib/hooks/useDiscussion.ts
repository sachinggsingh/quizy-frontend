"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchClient } from "@/lib/api"
import { toast } from "sonner"

export type CommentItem = {
  id: string
  user_id: string
  user_name: string
  content: string
  created_at: string
  likes?: number
  replies?: number
  liked?: boolean
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

export function useDiscussion() {
  const [comments, setComments] = useState<CommentItem[]>([])
  const [newComment, setNewComment] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await fetchClient("/comments")
      setComments(data ?? [])
    } catch (err) {
      console.error("Failed to load comments:", err)
      toast.error("Failed to load discussions")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) return
    try {
      setIsSubmitting(true)
      const savedComment = await fetchClient("/comments", {
        method: "POST",
        body: JSON.stringify({ content: newComment }),
      })
      setComments((prev) => [savedComment, ...prev])
      setNewComment("")
      toast.success("Comment posted successfully!")
    } catch (err) {
      console.error("Failed to post comment:", err)
      toast.error("Failed to post comment")
    } finally {
      setIsSubmitting(false)
    }
  }, [newComment])

  const handleLike = useCallback((id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, liked: !c.liked, likes: (c.likes ?? 0) + (c.liked ? -1 : 1) }
          : c
      )
    )
  }, [])

  const filteredComments = comments.filter(
    (c) =>
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.user_name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return {
    comments,
    newComment,
    setNewComment,
    searchQuery,
    setSearchQuery,
    isLoading,
    isSubmitting,
    filteredComments,
    loadComments,
    handleAddComment,
    handleLike,
  }
}
