"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface DiscussionFormProps {
  newComment: string
  onCommentChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function DiscussionForm({
  newComment,
  onCommentChange,
  onSubmit,
  isSubmitting,
}: DiscussionFormProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40 mb-8">
      <CardContent className="pt-6 space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Share your thoughts, tips, or questions with the community..."
          className="w-full p-4 rounded-lg bg-card/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 resize-none transition-all duration-300"
          rows={4}
          disabled={isSubmitting}
        />
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onCommentChange("")}
            className="border-border/50"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!newComment.trim() || isSubmitting}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
