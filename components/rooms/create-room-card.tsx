"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function buildBackendUrl(): string {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
  return backendUrl.replace(/\/$/, "")
}

export function CreateRoomCard() {
  const [roomId, setRoomId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const trimmed = roomId.trim()
    if (!trimmed) {
      setError("Room ID is required.")
      return
    }

    try {
      setIsLoading(true)
      const base = buildBackendUrl()
      const res = await fetch(`${base}/ws/room/${encodeURIComponent(trimmed)}`, {
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

      setSuccess("Room created successfully.")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Create Live Room</CardTitle>
        <CardDescription>
          Start a real-time session for your quiz. Only subscribed users can create rooms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateRoom} className="space-y-3">
          <Input
            placeholder="Enter room ID (e.g. my-quiz-room)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Room"}
          </Button>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-emerald-500">{success}</p>}
        </form>
      </CardContent>
    </Card>
  )
}

