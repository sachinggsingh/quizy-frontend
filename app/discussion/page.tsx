"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Heart, MessageCircle, MoreVertical, Search } from "lucide-react"
import { PageLoader } from "@/components/page-loader"
import { useDiscussion, formatRelativeTime } from "@/lib/hooks/useDiscussion"

export default function DiscussionPage() {
  const {
    comments,
    newComment,
    setNewComment,
    searchQuery,
    setSearchQuery,
    isLoading,
    isSubmitting,
    filteredComments,
    handleAddComment,
    handleLike,
  } = useDiscussion()

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent mb-2">
            Community Discussion
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect, share knowledge, and learn together with the MindClash community
          </p>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40 mb-8">
          <CardContent className="pt-6 space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts, tips, or questions with the community..."
              className="w-full p-4 rounded-lg bg-card/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none transition-all duration-300"
              rows={4}
              disabled={isSubmitting}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setNewComment("")}
                className="border-border/50"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || isSubmitting}
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-card/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border-primary/20 bg-gradient-to-br from-card/50 to-card/20">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {comments.length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Total Discussions</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-gradient-to-br from-card/50 to-card/20">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {comments.reduce((acc, c) => acc + (c.likes ?? 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Total Likes</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-gradient-to-br from-card/50 to-card/20">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {comments.reduce((acc, c) => acc + (c.replies ?? 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Total Replies</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {filteredComments.length > 0 ? (
            filteredComments.map((comment) => (
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
                      onClick={() => handleLike(comment.id)}
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
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No discussions found. Be the first to start a conversation!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
