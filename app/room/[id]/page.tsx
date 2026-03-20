"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { useAppSelector } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoaderFive } from "@/components/ui/loader"
import { ArrowLeft, Send, X, Trophy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import QuizForm from "@/components/rooms/create-quiz-InsideRoom"
import ParticipantQuiz from "@/components/rooms/participant-quiz"

function buildWsUrl(roomId: string): string {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
  const clean = backendUrl.replace(/\/$/, "")
  const protocol = clean.startsWith("https") ? "wss" : "ws"
  const base = clean.replace(/^https?:\/\//, "")
  return `${protocol}://${base}/ws/room/${roomId}`
}

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  
  const [messages, setMessages] = useState<{ userId: string; text: string; time: string }[]>([])
  const [inputText, setInputText] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hostId, setHostId] = useState<string | null>(null)
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null)
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [participantScores, setParticipantScores] = useState<{ userId: string; score: number }[]>([])
  const [participantCount, setParticipantCount] = useState(0)
  
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in")
      return
    }

    const connect = () => {
      try {
        const ws = new WebSocket(buildWsUrl(roomId))
        socketRef.current = ws

        ws.onopen = () => {
          console.log("WebSocket connected to room:", roomId)
          setIsConnected(true)
          setError(null)
        }

        ws.onmessage = (event) => {
          console.log("WebSocket message received:", event.data)
          try {
            const message = JSON.parse(event.data)
            console.log("Parsed message:", message)
            if (message.type === "ROOM_JOINED") {
              setHostId(message.data.host_id)
            }

            if (message.type === "ROOM_STATS") {
              setParticipantCount(message.data.participant_count)
            }

            if (message.type === "START_QUIZ") {
              setActiveQuiz(message.data)
            }

            if (message.type === "QUIZ_SUBMITTED") {
              setParticipantScores((prev) => {
                if (prev.find(p => p.userId === message.data.userId)) return prev
                return [...prev, message.data]
              })
            }

            if (message.type === "CLIENT_MESSAGE") {
                let text = ""
                try {
                    text = typeof message.data === 'string' ? message.data : JSON.stringify(message.data)
                } catch {
                    text = String(message.data)
                }

                setMessages((prev) => [
                    ...prev,
                    {
                        userId: "Other User",
                        text: text,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                ])
            }
          } catch (e) {
            console.error("Failed to parse message", e)
          }
        }

        ws.onclose = () => setIsConnected(false)
        ws.onerror = () => setError("WebSocket connection error.")
      } catch (err) {
        setError("Failed to connect to the room.")
      }
    }

    connect()

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [roomId, isAuthenticated, router])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return

    const msg = inputText.trim()
    socketRef.current.send(msg)
    
    setMessages((prev) => [
      ...prev,
      {
        userId: "You",
        text: msg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
    setInputText("")
  }

  const isHost = user?.id === hostId

  if (!isConnected && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoaderFive text="Connecting to room..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8">
        {/* Simplified Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
          <div className="flex items-start gap-4">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push("/dashboard")}
                className="mt-1 hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black tracking-tight">Live Room</h1>
                <Badge variant={isConnected ? "secondary" : "destructive"} className="px-3 py-1">
                    {isConnected ? "Active" : "Offline"}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Hosting dynamic quiz sessions for your audience
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <div className="px-4 py-2 bg-muted/30 rounded-xl border border-border/50 flex items-center gap-4">
                <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Room ID</p>
                    <p className="text-sm font-mono font-bold text-primary">{roomId}</p>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-accent" 
                    onClick={() => navigator.clipboard.writeText(roomId)}
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                </Button>
             </div>
             <Button variant="destructive" className="font-bold uppercase tracking-wide px-6" onClick={() => router.push("/dashboard")}>
                End Room
              </Button>
          </div>
        </div>

        {error && (
            <Card className="border-destructive/50 bg-destructive/5 animate-in fade-in zoom-in">
                <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                        <X className="h-5 w-5 text-destructive" />
                        <div>
                            <p className="font-bold text-destructive">Connection Failed</p>
                            <p className="text-xs text-destructive/80">{error}</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </CardContent>
            </Card>
        )}

        <div className="grid grid-cols-1 gap-8 items-start">
            {/* Main Content Area */}
            <div className="space-y-8">
                {isHost ? (
                    <div className="space-y-8">
                        <QuizForm onPublish={(quizData) => {
                            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                                socketRef.current.send(JSON.stringify({
                                    type: "START_QUIZ",
                                    data: quizData,
                                    room_id: roomId
                                }))
                                setActiveQuiz(quizData)
                            }
                        }} />
                        
                        {participantScores.length > 0 && (
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                <CardHeader className="border-b border-border/50 py-4">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-primary" />
                                        Leaderboard
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="space-y-3">
                                        {participantScores.sort((a,b) => b.score - a.score).map((p, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl border border-border/50">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-mono text-muted-foreground">#{(idx + 1).toString().padStart(2, '0')}</span>
                                                    <span className="font-bold">{p.userId}</span>
                                                </div>
                                                <span className="text-lg font-black text-primary">{p.score} pts</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ) : (
                    isQuizStarted ? (
                        <ParticipantQuiz 
                            quiz={activeQuiz} 
                            onSubmit={(score) => {
                                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                                    socketRef.current.send(JSON.stringify({
                                        type: "QUIZ_SUBMITTED",
                                        data: { userId: user?.email || "Anonymous", score },
                                        room_id: roomId
                                    }))
                                }
                            }} 
                        />
                    ) : (
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm p-12 text-center shadow-sm">
                            <div className="max-w-md mx-auto space-y-6">
                                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <LoaderFive text="" />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tight">
                                    {activeQuiz ? "Quiz Ready" : "Waiting for Host"}
                                </h2>
                                <p className="text-muted-foreground font-medium">
                                    {activeQuiz 
                                        ? `The host has published: "${activeQuiz.title}". Click below to join!` 
                                        : "The host is currently setting up the quiz. Please stay tuned!"}
                                </p>
                                {activeQuiz && (
                                    <Button 
                                        onClick={() => setIsQuizStarted(true)}
                                        className="w-full py-6 text-lg font-bold shadow-lg hover:scale-[1.01] transition-transform"
                                    >
                                        Start Attempt
                                    </Button>
                                )}
                            </div>
                        </Card>
                    )
                )}
            </div>
        </div>
      </div>
    </div>
  )
}
