"use client"

import { QuizCard } from "@/components/quiz-card"
import { StatsCard } from "@/components/stats-card"
import { useDashboardData } from "@/lib/hooks/useDashboardData"
import { LoaderThree, LoaderFive } from "@/components/ui/loader"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const {
    quizzes,
    completedQuizzes,
    averageScore,
    rank,
    filter,
    setFilter,
    filteredQuizzes,
    effectivelyLoading,
    error,
  } = useDashboardData()

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard label="Total Quizzes" value={quizzes?.length || 0} subtext="Available quizzes" />
          <StatsCard
            label="Completed"
            value={completedQuizzes}
            subtext={`${(quizzes?.length || 0) > 0 ? Math.round((completedQuizzes / quizzes.length) * 100) : 0}% progress`}
          />
          <StatsCard label="Average Score" value={`${Math.round(averageScore)}%`} subtext="Across completed quizzes" />
          <StatsCard label="Global Rank" value={`#${rank}`} subtext="Your position globally" />
        </div>


        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Available Quizzes</h2>
              <p className="text-muted-foreground">Choose a quiz to test your knowledge</p>
            </div>
            <div className="flex bg-accent/20 p-1 gap-2 rounded-xl border border-border/50">
              <Button
                onClick={() => setFilter("new")}
                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  filter === "new"
                    ? "cursor-pointer bg-primary text-white shadow-md shadow-primary/20"
                    : "cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent/30"
                }`}
              >
                New Quizzes
              </Button>
              <Button
                onClick={() => setFilter("attempted")}
                className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  filter === "attempted"
                    ? "cursor-pointer bg-primary text-white shadow-md shadow-primary/20"
                    : "cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent/30"
                }`}
              >
                Attempted
              </Button>
            </div>
          </div>

          {effectivelyLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <LoaderThree />
              <LoaderFive text="Fetching Quizzes..." />
            </div>
          ) : error ? (
            <div className="text-destructive text-center py-10 bg-destructive/10 rounded-lg border border-destructive/20">
              {error}
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl bg-accent/5">
              <div className="max-w-xs mx-auto">
                <p className="text-lg font-medium mb-1">
                  {filter === "attempted" ? "No attempted quizzes" : "You've finished them all!"}
                </p>
                <p className="text-sm opacity-70">
                  {filter === "attempted"
                    ? "Start a new quiz to track your progress here."
                    : "Check back later for fresh challenges or retake an old one."}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  id={quiz.id}
                  title={quiz.title}
                  description={quiz.description || `Challenge yourself with our ${quiz.title} quiz!`}
                  difficulty={quiz.difficulty || "Medium"}
                  questions={quiz.questions ? quiz.questions.length : 0}
                  completed={quiz.attempted || false}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
