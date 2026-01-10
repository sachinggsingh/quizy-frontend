import { DashboardHeader } from "@/components/dashboard-header"
import { QuizCard } from "@/components/quiz-card"
import { StatsCard } from "@/components/stats-card"

const mockQuizzes = [
  {
    id: "1",
    title: "React Fundamentals",
    description: "Test your knowledge of React hooks and components",
    difficulty: "Medium" as const,
    questions: 20,
    completed: true,
    score: 85,
  },
  {
    id: "2",
    title: "JavaScript Basics",
    description: "Master the fundamentals of JavaScript",
    difficulty: "Easy" as const,
    questions: 15,
    completed: true,
    score: 92,
  },
  {
    id: "3",
    title: "Web Design Principles",
    description: "Learn about design patterns and best practices",
    difficulty: "Easy" as const,
    questions: 18,
    completed: false,
  },
  {
    id: "4",
    title: "Advanced TypeScript",
    description: "Deep dive into TypeScript advanced features",
    difficulty: "Hard" as const,
    questions: 25,
    completed: false,
  },
  {
    id: "5",
    title: "Data Structures & Algorithms",
    description: "Challenge yourself with algorithm problems",
    difficulty: "Hard" as const,
    questions: 30,
    completed: false,
  },
  {
    id: "6",
    title: "CSS Mastery",
    description: "Become a CSS expert with advanced techniques",
    difficulty: "Medium" as const,
    questions: 20,
    completed: true,
    score: 78,
  },
]

export default function DashboardPage() {
  const completedQuizzes = mockQuizzes.filter((q) => q.completed).length
  const averageScore =
    mockQuizzes.filter((q) => q.completed).reduce((acc, q) => acc + (q.score || 0), 0) / completedQuizzes || 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard label="Total Quizzes" value={mockQuizzes.length} subtext="Available quizzes" />
          <StatsCard
            label="Completed"
            value={completedQuizzes}
            subtext={`${Math.round((completedQuizzes / mockQuizzes.length) * 100)}% progress`}
          />
          <StatsCard label="Average Score" value={`${Math.round(averageScore)}%`} subtext="Across completed quizzes" />
          <StatsCard label="Global Rank" value="#1,234" subtext="Out of 50,000+ users" />
        </div>

        {/* Quizzes Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Available Quizzes</h2>
            <p className="text-muted-foreground">Choose a quiz to test your knowledge</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} {...quiz} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
