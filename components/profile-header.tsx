"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit2, LogOut } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks"
import { logoutUser } from "@/lib/features/auth/authSlice"

interface ProfileHeaderProps {
  user: any
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [isHovered, setIsHovered] = useState(false)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logoutUser())
    window.location.href = "/"
  }

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "???"
  }

  return (
    <div className="relative">
      {/* Animated gradient background */}
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl group"></div>

      <Card className="relative border-primary/20 bg-gradient-to-br from-card/80 to-card/40 overflow-hidden">
        {/* Animated gradient overlay on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 transition-opacity duration-500 ${
            isHovered ? "opacity-100" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        ></div>

        <CardHeader className="relative pb-0">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Profile Avatar with animated border */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 animate-spin-slow"></div>
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
                  {getInitials(user?.name)}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-accent">
                  {user?.name || "Loading..."}
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email || "..."}</p>
                <p className="text-xs text-muted-foreground mt-1">Member since January 2024</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-border/50 bg-transparent hover:bg-primary/10 transition-all duration-300"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/50 bg-transparent hover:bg-destructive/10 text-destructive transition-all duration-300"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative">
          {/* Bio section */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {user?.bio || "Passionate learner and quiz enthusiast. Always looking to expand my knowledge and compete fairly on the leaderboard."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
