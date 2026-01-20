"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/lib/hooks"
import { logoutUser } from "@/lib/features/auth/authSlice"
import { ModeToggle } from "@/components/mode-toggle"

export function DashboardHeader() {
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logoutUser())
    window.location.href = "/"
  }

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">Q</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground">QuizMaster</h1>
            <p className="text-xs text-muted-foreground">Test your knowledge</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-foreground hover:text-primary font-medium transition-colors nav-link pb-1">
            Dashboard
          </Link>
          <Link href="/leaderboard" className="text-foreground hover:text-primary font-medium transition-colors nav-link pb-1">
            Leaderboard
          </Link>
          <Link href="/profile" className="text-foreground hover:text-primary font-medium transition-colors nav-link pb-1">
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
