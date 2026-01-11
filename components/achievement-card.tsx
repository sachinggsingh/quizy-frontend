"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface AchievementCardProps {
  title: string
  description: string
  icon: string
  achieved: boolean
  unlockedDate?: string
}

export function AchievementCard({ title, description, icon, achieved, unlockedDate }: AchievementCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div
        className={`absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 transition-opacity duration-300 blur ${
          achieved && isHovered ? "opacity-100" : ""
        }`}
      ></div>

      <Card
        className={`relative p-4 border text-center transition-all duration-300 h-full flex flex-col items-center justify-center gap-2 ${
          achieved
            ? "border-primary/50 bg-gradient-to-br from-primary/10 to-accent/10"
            : "border-border/30 bg-card/30 opacity-50"
        }`}
      >
        <div className={`text-3xl transition-all duration-300 ${achieved && isHovered ? "scale-125" : "scale-100"}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
        {achieved && unlockedDate && <p className="text-xs text-primary font-medium mt-1">Unlocked {unlockedDate}</p>}
      </Card>
    </div>
  )
}
