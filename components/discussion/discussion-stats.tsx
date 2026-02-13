"use client"

import { Card, CardContent } from "@/components/ui/card"

interface DiscussionStatsProps {
  totalDiscussions: number
  totalLikes: number
  totalReplies: number
}

export function DiscussionStats({ totalDiscussions, totalLikes, totalReplies }: DiscussionStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <Card className="border-primary/20 bg-gradient-to-br from-card/50 to-card/20">
        <CardContent className="pt-6 text-center">
          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {totalDiscussions}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Total Discussions</p>
        </CardContent>
      </Card>
      <Card className="border-primary/20 bg-gradient-to-br from-card/50 to-card/20">
        <CardContent className="pt-6 text-center">
          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {totalLikes}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Total Likes</p>
        </CardContent>
      </Card>
      <Card className="border-primary/20 bg-gradient-to-br from-card/50 to-card/20">
        <CardContent className="pt-6 text-center">
          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            {totalReplies}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Total Replies</p>
        </CardContent>
      </Card>
    </div>
  )
}
