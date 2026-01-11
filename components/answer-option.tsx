"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface AnswerOptionProps {
  id: string
  text: string
  isSelected: boolean
  isCorrect?: boolean
  isSubmitted?: boolean
  onSelect: (id: string) => void
}

export function AnswerOption({ id, text, isSelected, isCorrect, isSubmitted, onSelect }: AnswerOptionProps) {
  const [isHovered, setIsHovered] = useState(false)

  let bgColor = "bg-card/50 hover:bg-card/80"
  let borderColor = "border-border/50 hover:border-primary/50"

  if (isSubmitted) {
    if (isCorrect) {
      bgColor = "bg-green-500/10"
      borderColor = "border-green-500/50"
    } else if (isSelected && !isCorrect) {
      bgColor = "bg-red-500/10"
      borderColor = "border-red-500/50"
    }
  }

  if (isSelected && !isSubmitted) {
    bgColor = "bg-primary/10"
    borderColor = "border-primary/50"
  }

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="relative group">
      {isSelected && !isSubmitted && (
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary/30 to-accent/30 opacity-50 group-hover:opacity-100 transition-opacity duration-300 blur" />
      )}
      <Card
        onClick={() => !isSubmitted && onSelect(id)}
        className={`relative p-4 cursor-pointer transition-all duration-300 border-2 ${bgColor} ${borderColor} ${
          !isSubmitted && "hover:shadow-lg"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/50 group-hover:border-primary/50"
            }`}
          >
            {isSelected && <span className="text-xs font-bold">✓</span>}
          </div>
          <span className="text-foreground font-medium leading-relaxed text-balance">{text}</span>
          {isSubmitted && isCorrect && <span className="ml-auto text-green-500 font-bold text-lg">✓</span>}
          {isSubmitted && isSelected && !isCorrect && <span className="ml-auto text-red-500 font-bold text-lg">✗</span>}
        </div>
      </Card>
    </div>
  )
}
