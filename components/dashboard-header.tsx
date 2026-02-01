"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/lib/hooks"
import { logoutUser } from "@/lib/features/auth/authSlice"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationsDropdown } from "./notifications-dropdown"
import { PlanBadge } from "./plan-badge"
import { getSubscription } from "@/lib/api/subscription"
import type { PlanType } from "./plan-badge"

export function DashboardHeader() {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const [plan, setPlan] = useState<PlanType>("free")

  useEffect(() => {
    getSubscription()
      .then((sub) => {
        if (sub?.status === "active" && (sub?.plan === "pro" || sub?.plan === "enterprise")) {
          setPlan(sub.plan as PlanType)
        } else {
          setPlan("free")
        }
      })
      .catch(() => setPlan("free"))
  }, [])

  // Define public routes where the header should NOT be visible
  const publicRoutes = ["/", "/sign-in", "/sign-up"]
  
  // Also check if it's strictly a public route. 
  // If we have dynamic public routes, we might need more complex logic, 
  // but for now strict equality is good for established routes.
  if (publicRoutes.includes(pathname)) {
    return null
  }

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
            <h1 className="text-xl font-bold text-foreground">MindClash</h1>
            <p className="text-xs text-muted-foreground">Test your knowledge</p>
          </div>
        </div>

        <nav className="hidden">
          <Link href="/dashboard" className="text-foreground hover:text-primary font-medium transition-colors nav-link pb-1">
            Dashboard
          </Link>
          <Link href="/leaderboard" className="text-foreground hover:text-primary font-medium transition-colors nav-link pb-1">
            Leaderboard
          </Link>
          <Link href="/profile" className="text-foreground hover:text-primary font-medium transition-colors nav-link pb-1">
            Profile
          </Link>
          <Link href="/discussion" className="text-foreground hover:text-primary font-medium transition-colors nav-link pb-1">
            Discussion
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* Universal Actions (Desktop & Mobile) */}
          <div className="flex items-center gap-2">
            <PlanBadge plan={plan} showLabel={true} size="sm" />
            <ModeToggle />
            <NotificationsDropdown />
          </div>
          
          {/* Mobile-only Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
