"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"

interface AnswerFeedbackProps {
  isCorrect: boolean
}

export function AnswerFeedback({ isCorrect }: AnswerFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
    >
      <Card className={`overflow-hidden border-2 ${
        isCorrect
          ? "border-green-500/30 bg-green-500/5"
          : "border-red-500/30 bg-red-500/5"
      }`}>
        <div className="flex items-center gap-3 p-5">
          {isCorrect ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
          <p className={`font-bold ${
            isCorrect 
              ? "text-green-600 dark:text-green-400" 
              : "text-red-600 dark:text-red-400"
          }`}>
            {isCorrect
              ? "Correct! Well done."
              : "Incorrect. Better luck with the next one!"}
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
