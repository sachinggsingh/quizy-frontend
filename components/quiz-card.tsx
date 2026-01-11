import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface QuizCardProps {
  id: string
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  questions: number
  completed: boolean
  score?: number
}

export function QuizCard({ id, title, description, difficulty, questions, completed, score }: QuizCardProps) {
  const difficultyColor = {
    Easy: "bg-green-500/20 text-green-700 dark:text-green-400",
    Medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    Hard: "bg-red-500/20 text-red-700 dark:text-red-400",
  }

  return (
    <Card className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg group h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">{title}</CardTitle>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${difficultyColor[difficulty]}`}>
            {difficulty}
          </span>
        </div>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{questions} Questions</span>
          {completed && score !== undefined && <span className="text-primary font-semibold">Score: {score}%</span>}
        </div>

        {completed ? (
          <Button asChild className="w-full bg-primary/70 hover:bg-primary text-primary-foreground">
            <Link href={`/quiz/${id}`}>Retake Quiz</Link>
          </Button>
        ) : (
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href={`/quiz/${id}`}>Start Quiz</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
