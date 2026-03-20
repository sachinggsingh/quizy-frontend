"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ChevronRight, Trophy } from "lucide-react"

interface Question {
  text: string
  options: string[]
  answer: number
}

interface ParticipantQuizProps {
  quiz: {
    title: string
    questions: Question[]
    points: number
  }
  onSubmit: (score: number) => void
}

export default function ParticipantQuiz({ quiz, onSubmit }: ParticipantQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex) / quiz.questions.length) * 100

  const handleNext = () => {
    if (selectedOption === currentQuestion.answer) {
      setScore(prev => prev + quiz.points)
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedOption(null)
    } else {
      setIsFinished(true)
      onSubmit(score + (selectedOption === currentQuestion.answer ? quiz.points : 0))
    }
  }

  if (isFinished) {
    return (
      <Card className="border-primary/20 bg-background/50 backdrop-blur-sm p-12 text-center shadow-2xl animate-in zoom-in duration-300">
        <div className="max-w-md mx-auto space-y-8">
          <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-primary/10">
            <Trophy className="h-12 w-12 text-primary animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tight text-primary">Quiz Completed!</h2>
            <p className="text-muted-foreground font-bold">You've finished the session.</p>
          </div>
          
          <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10 space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Final Score</p>
            <p className="text-6xl font-black text-primary italic">{score + (selectedOption === currentQuestion.answer ? quiz.points : 0)}</p>
          </div>

          <p className="text-sm text-muted-foreground">
            Waiting for other participants to finish. The host will reveal the leaderboard soon!
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-primary/20 bg-background/50 backdrop-blur-sm shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      <CardHeader className="bg-primary/5 border-b border-primary/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold uppercase tracking-tighter">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Badge>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="p-8 space-y-8">
        <h3 className="text-2xl font-black leading-tight text-primary italic uppercase tracking-tight">
          {currentQuestion.text}
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              className={`group flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                selectedOption === idx
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 -translate-y-1"
                  : "border-primary/5 bg-muted/30 hover:border-primary/20 hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black transition-colors ${
                    selectedOption === idx ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                }`}>
                    {String.fromCharCode(65 + idx)}
                </div>
                <span className={`font-bold transition-colors ${selectedOption === idx ? "text-primary" : "text-foreground"}`}>
                    {option}
                </span>
              </div>
              {selectedOption === idx && <CheckCircle2 className="h-6 w-6 text-primary animate-in zoom-in" />}
            </button>
          ))}
        </div>

        <Button 
          onClick={handleNext}
          disabled={selectedOption === null}
          className="w-full py-8 text-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-transform active:scale-[0.98]"
        >
          {currentQuestionIndex === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
          <ChevronRight className="ml-2 h-6 w-6" />
        </Button>
      </CardContent>
    </Card>
  )
}
