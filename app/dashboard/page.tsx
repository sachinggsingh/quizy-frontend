"use client"


import { QuizCard } from "@/components/quiz-card"
import { StatsCard } from "@/components/stats-card"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchQuizzes } from "@/lib/features/quiz/quizSlice"
import { fetchProfile } from "@/lib/features/auth/authSlice"
import { useEffect, useState } from "react"
import { LoaderThree, LoaderFive } from "@/components/ui/loader"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { quizzes, isLoading, error } = useAppSelector((state) => state.quiz)
  const [showMinLoader, setShowMinLoader] = useState(true)
  const [globalRank, setGlobalRank] = useState<number | string>("-")
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchQuizzes())
    dispatch(fetchProfile())
    
    const timer = setTimeout(() => {
      setShowMinLoader(false)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [dispatch])

  // Connect to WebSocket to get real-time leaderboard data for rank calculation
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return

    let socket: WebSocket | null = null
    let reconnectTimeout: NodeJS.Timeout
    let isMounted = true

    const calculateRank = (users: any[]) => {
      if (users.length === 0) return
      
      // Find current user's position in the sorted leaderboard
      const userIndex = users.findIndex((u: any) => u.id === user?.id)
      if (userIndex !== -1) {
        // User is in the leaderboard, rank is their position + 1
        setGlobalRank(userIndex + 1)
      } else {
        // User not in top 10, estimate rank based on score comparison
        // This gives a minimum rank (could be higher if there are users with same score)
        const usersWithHigherScore = users.filter((u: any) => u.score > (user?.score || 0))
        const minRank = usersWithHigherScore.length + 1
        // If user's score is less than the last person in top 10, they're definitely > 10
        if (users.length > 0 && user?.score !== undefined && user.score < users[users.length - 1]?.score) {
          setGlobalRank(`>${users.length}`) // Show ">10" if not in top 10
        } else {
          setGlobalRank(minRank)
        }
      }
    }

    const connect = () => {
      if (!isMounted) return

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
      const cleanBackendUrl = backendUrl.replace(/\/$/, "")
      const wsProtocol = cleanBackendUrl.startsWith("https") ? "wss" : "ws"
      const wsBaseUrl = cleanBackendUrl.replace(/^https?:\/\//, "")
      const wsUrl = `${wsProtocol}://${wsBaseUrl}/ws/leaderboard`
      
      try {
        const ws = new WebSocket(wsUrl)
        socket = ws

        ws.onopen = () => {
          console.log("Dashboard WebSocket connected for rank updates")
        }

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            
            let users: any[] = []
            if (message.type === "LEADERBOARD_UPDATE" && Array.isArray(message.data)) {
              users = message.data
            } else if (Array.isArray(message)) {
              users = message
            }

            if (users.length > 0) {
              calculateRank(users)
            }
          } catch (err) {
            console.error("Failed to parse leaderboard data in dashboard:", err)
          }
        }

        ws.onerror = () => {
          console.warn("Dashboard WebSocket error for rank updates")
        }

        ws.onclose = (event) => {
          if (isMounted && event.code !== 1000 && event.code !== 1001) {
            reconnectTimeout = setTimeout(connect, 3000)
          }
        }
      } catch (err) {
        console.error("Failed to create WebSocket connection for dashboard:", err)
        if (isMounted) {
          reconnectTimeout = setTimeout(connect, 5000)
        }
      }
    }

    if (typeof window !== "undefined") {
      connect()
    }

    return () => {
      isMounted = false
      clearTimeout(reconnectTimeout)
      if (socket) {
        try {
          if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
            socket.close(1000, "Component unmounting")
          }
        } catch (err) {
          // Ignore errors during cleanup
        }
        socket = null
      }
    }
  }, [isAuthenticated, user?.id, user?.score])

  // Use real user data if available in redux, otherwise 0/default
  const completedQuizzes = user?.completedQuizzes || 0 
  const averageScore = user?.averageScore || 0
  const rank = globalRank // Use rank from WebSocket instead of user.rank

  const effectivelyLoading = isLoading || showMinLoader
  const [filter, setFilter] = useState<"new" | "attempted">("new")

  const filteredQuizzes = quizzes.filter(quiz => 
    filter === "attempted" ? quiz.attempted : !quiz.attempted
  )

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
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

        {/* Quizzes Section */}
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
             <div className="text-destructive text-center py-10 bg-destructive/10 rounded-lg border border-destructive/20">{error}</div>
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
