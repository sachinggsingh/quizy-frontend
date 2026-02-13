"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trophy } from "lucide-react"

interface QuizCompletionScreenProps {
  quizTitle: string
  score: number
  totalPoints: number
  totalQuestions: number
  answeredCount: number
}

export function QuizCompletionScreen({
  quizTitle,
  score,
  totalPoints,
  totalQuestions,
  answeredCount,
}: QuizCompletionScreenProps) {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 border-2 border-primary/20 mb-4">
          <Trophy className="w-12 h-12 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight text-foreground">
            Quiz Completed!
          </h1>
          <p className="text-xl text-muted-foreground">
            You've successfully finished <span className="text-primary font-bold">{quizTitle}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-8 border-primary/20 bg-primary/5">
            <p className="text-4xl font-black text-primary mb-1">
              {score} <span className="text-lg opacity-60">/ {totalPoints}</span>
            </p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Points Earned
            </p>
          </Card>
          <Card className="p-8 border-border/50">
            <p className="text-4xl font-black text-foreground mb-1">{totalQuestions}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Questions
            </p>
          </Card>
          <Card className="p-8 border-border/50">
            <p className="text-4xl font-black text-accent mb-1">{answeredCount}</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Answered
            </p>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button asChild className="h-14 px-8 rounded-xl bg-primary text-primary-foreground font-bold text-lg">
            <Link href="/quiz">Back to Quizzes</Link>
          </Button>
          <Button asChild variant="outline" className="h-14 px-8 rounded-xl border-border/50 font-bold text-lg">
            <Link href="/leaderboard">View Leaderboard</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
