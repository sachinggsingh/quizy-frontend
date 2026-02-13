"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CategoryCardProps {
  title: string
  description: string
  icon: React.ElementType
  quizCount: number
  color: string // Kept for prop consistency
  index: number
}

export function CategoryCard({ title, description, quizCount, index }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Standardized blue theme styles (as per user's latest manual update)
  const theme = {
    icon: "text-blue-500 bg-blue-500/10",
    glow: "bg-blue-500",
    gradient: "from-blue-500/20 to-blue-600/5",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <Link href={`/quiz?category=${title}`} className="block h-full">
        <Card className={cn(
          "relative h-full overflow-hidden border-2 transition-all duration-300 rounded-2xl bg-card/50 backdrop-blur-sm flex flex-col",
          isHovered ? "border-primary/40 scale-[1.02] shadow-xl shadow-primary/5" : "border-primary/20"
        )}>
          {/* Torch Light Effect: Focused radial gradient from top-left */}
          <div className={cn(
            "absolute inset-0 transition-opacity duration-500 pointer-events-none z-0",
            "bg-[radial-gradient(circle_at_0%_0%,rgba(59,130,246,0.15),transparent_60%)]",
            isHovered ? "opacity-100" : "opacity-0"
          )} />

          <CardContent className="relative flex flex-col h-full flex-1 z-10 p-6">
            {/* Content Section */}
            <div className="space-y-3 flex-1 mb-2">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors">
                  {title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>

            {/* Action Footer: "Take Quiz" pops from left to right */}
            <div className="mt-8 relative overflow-hidden h-12 flex items-center justify-between">
              <div className="relative flex-1 overflow-hidden">
                <span className={cn(
                  "text-sm font-black uppercase tracking-widest text-primary transition-all duration-500 transform block",
                  isHovered ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
                )}>
                  Take Quiz
                </span>
              </div>
              
              <div className={cn(
                "w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center transition-all duration-500 shadow-lg shadow-primary/20",
                isHovered ? "bg-primary rotate-0" : "bg-primary/20 text-primary rotate-45 scale-90"
              )}>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </CardContent>

          {/* Decorative Corner Glow (Subtle "torch" origin point) */}
          <div className={cn(
            "absolute -top-12 -left-12 w-48 h-48 rounded-full blur-[80px] opacity-0 transition-all duration-700 pointer-events-none",
            isHovered && "opacity-20",
            theme.glow
          )} />
        </Card>
      </Link>
    </motion.div>
  )
}
