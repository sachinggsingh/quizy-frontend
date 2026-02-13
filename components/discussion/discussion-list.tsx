"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, MessageCircle, MoreVertical } from "lucide-react"
import { formatRelativeTime } from "@/lib/hooks/useDiscussion"

interface Comment {
  id: string
  user_name: string
  content: string
  created_at: string
  likes: number
  replies: number
  liked: boolean
}

interface DiscussionListProps {
  comments: Comment[]
  onLike: (id: string) => void
}

export function DiscussionList({ comments, onLike }: DiscussionListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No discussions found. Be the first to start a conversation!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card
          key={comment.id}
          className="border-primary/20 bg-gradient-to-br from-card/50 to-card/20 hover:border-primary/40 hover:bg-card/30 transition-all duration-300 group"
        >
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {(comment.user_name ?? "?")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "?"}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-foreground">{comment.user_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatRelativeTime(comment.created_at)}
                  </p>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 hover:bg-card/50 rounded-lg">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <p className="text-foreground/90 leading-relaxed mb-4">{comment.content}</p>
            <div className="flex items-center gap-6 text-sm pt-4 border-t border-border/20">
              <button
                onClick={() => onLike(comment.id)}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${
                    comment.liked ? "fill-destructive text-destructive" : ""
                  }`}
                />
                <span className={`font-medium ${comment.liked ? "text-destructive" : ""}`}>
                  {comment.likes ?? 0}
                </span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200">
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">{comment.replies ?? 0}</span>
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
