"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Copy, ArrowRight, RefreshCw } from "lucide-react"

function buildBackendUrl(): string {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
  return backendUrl.replace(/\/$/, "")
}

export function CreateRoomCard() {
  const router = useRouter()
  const [generatedRoomId, setGeneratedRoomId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setGeneratedRoomId(null)

    try {
      setIsLoading(true)
      const base = buildBackendUrl()
      const res = await fetch(`${base}/ws/room`, {
        method: "POST",
        credentials: "include",
      })

      if (!res.ok) {
        const text = await res.text().catch(() => "")
        if (res.status === 401) {
          setError("You must be signed in to create a room.")
        } else if (res.status === 403) {
          setError("You need an active subscription to create rooms.")
        } else {
          setError(text || "Failed to create room. Please try again.")
        }
        return
      }

      const data = await res.json()
      setGeneratedRoomId(data.room_id)
      setSuccess("Room created successfully!")
      
      // Auto-redirect after a short delay so the user can see the ID if they want
      setTimeout(() => {
        router.push(`/room/${data.room_id}`)
      }, 2000)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (generatedRoomId) {
      navigator.clipboard.writeText(generatedRoomId)
      setSuccess("Room ID copied to clipboard!")
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  return (
    <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-xl group flex flex-col h-full bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Plus className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-bold">Create Live Room</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          Generate a unique room ID to start a live session with others.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-center pt-4 space-y-4">
        {!generatedRoomId ? (
          <Button 
            onClick={handleCreateRoom} 
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all active:scale-[0.98]" 
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Generating..." : "Generate Room ID"}
          </Button>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="p-4 bg-muted/50 rounded-xl flex items-center justify-between border border-primary/20 group/code hover:bg-muted transition-colors">
              <code className="text-primary font-mono text-lg font-bold tracking-wider">{generatedRoomId}</code>
              <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-9 px-3 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => setGeneratedRoomId(null)} 
                variant="outline" 
                className="h-10 rounded-xl border-border/50 hover:bg-accent transition-all"
              >
                Reset
              </Button>
              <Button 
                onClick={() => router.push(`/room/${generatedRoomId}`)}
                className="h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
              >
                Go to Room
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        <div className="min-h-[20px]">
          {error && <p className="text-sm text-destructive font-medium animate-in fade-in duration-300">{error}</p>}
          {success && <p className="text-sm text-emerald-500 font-medium animate-in fade-in duration-300">{success}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

