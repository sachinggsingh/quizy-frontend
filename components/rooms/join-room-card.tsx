"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LogIn, ArrowRight, RefreshCw, Hash } from "lucide-react"

function buildBackendUrl(): string {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
  return backendUrl.replace(/\/$/, "")
}

export function JoinRoomCard() {
  const router = useRouter()
  const [roomId, setRoomId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmed = roomId.trim()
    if (!trimmed) {
      setError("Please enter a Room ID.")
      return
    }

    try {
      setIsLoading(true)
      const base = buildBackendUrl()
      // For now, we just "validate" by trying to connect or check existence
      // Since we don't have a room page yet, we'll just show a success message
      // or navigate if we had one.
      const res = await fetch(`${base}/api/room/${encodeURIComponent(trimmed)}/validate`, {
          method: "GET",
          credentials: "include",
      })

      if (res.status === 404) {
          setError("Room not found. Please check the ID.")
          return
      }

      if (res.status === 401) {
          setError("Please sign in to join the room.")
          return
      }

      if (!res.ok) {
          setError("Failed to join room. Please try again.")
          return
      }

      // If we got here, the room likely exists (or at least the route is valid)
      router.push(`/room/${trimmed}`)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl group flex flex-col h-full bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <LogIn className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-bold">Join Live Room</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          Enter a room ID to join an existing live session and compete.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-center pt-4">
        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div className="relative group/input">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
            <Input
              placeholder="Enter room ID (e.g. ROOM-123)"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              disabled={isLoading}
              className="pl-10 h-11 bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all"
            />
          </div>
          
          <Button 
            type="submit" 
            variant="secondary" 
            className="w-full h-11 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-xl transition-all active:scale-[0.98]" 
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Joining..." : "Join Room"}
          </Button>
          
          <div className="min-h-[20px]">
            {error && <p className="text-sm text-destructive font-medium animate-in fade-in duration-300">{error}</p>}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
