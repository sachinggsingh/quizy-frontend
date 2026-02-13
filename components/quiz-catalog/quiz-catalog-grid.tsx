"use client"

import { motion } from "framer-motion"
import { QuizCard } from "@/components/quiz-card"

interface QuizCatalogGridProps {
  quizzes: any[]
}

export function QuizCatalogGrid({ quizzes }: QuizCatalogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {quizzes.map((quiz, index) => (
        <motion.div 
          key={quiz.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <QuizCard
            id={quiz.quiz_id || quiz.id}
            title={quiz.title}
            description={quiz.description || `Challenge yourself with our ${quiz.title} quiz!`}
            difficulty={quiz.difficulty || "Medium"}
            questions={quiz.questions ? quiz.questions.length : 0}
            completed={quiz.attempted || false}
          />
        </motion.div>
      ))}
    </div>
  )
}
