"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LeaderboardFooter() {
  return (
    <div className="mt-8 text-center">
      <p className="text-muted-foreground mb-4">
        Keep grinding to climb the leaderboard and unlock exclusive rewards!
      </p>
      <Button className="bg-primary text-white transition-all duration-300" asChild>
        <Link href="/dashboard">Take a Quiz to Earn Points</Link>
      </Button>
    </div>
  )
}
