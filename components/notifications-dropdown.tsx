  "use client"

  import React, { useState, useEffect } from "react"
  import { Bell, X, AlertCircle } from "lucide-react"
  import { ScrollArea } from "@/components/ui/scroll-area"
  import { toast } from "sonner"

  interface Notification {
    id: string
    type: "achievement" | "quiz" | "leaderboard" | "alert"
    title: string
    message: string
    timestamp: string
    read: boolean
    icon: React.ReactNode
  }

  export function NotificationsDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])

    const unreadCount = notifications.filter((n) => !n.read).length

    useEffect(() => {
      let socket: WebSocket | null = null
      let reconnectTimeout: NodeJS.Timeout
      let isMounted = true
      let isConnecting = false

      const connect = () => {
        // Prevent multiple simultaneous connection attempts
        if (!isMounted || isConnecting || (socket && socket.readyState === WebSocket.CONNECTING)) {
          return
        }

        // Close existing connection if any
        if (socket) {
          try {
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
              socket.close(1000, "Reconnecting")
            }
          } catch (err) {
            // Ignore errors when closing
          }
          socket = null
        }

        isConnecting = true

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
        // Ensure backendUrl doesn't have a trailing slash
        const cleanBackendUrl = backendUrl.replace(/\/$/, "")
        // Replace http/https with ws/wss
        const wsProtocol = cleanBackendUrl.startsWith("https") ? "wss" : "ws"
        const wsBaseUrl = cleanBackendUrl.replace(/^https?:\/\//, "")
        const wsUrl = `${wsProtocol}://${wsBaseUrl}/ws/leaderboard`
        
        try {
          console.log("Connecting to Notifications WebSocket:", wsUrl)
          const ws = new WebSocket(wsUrl)
          socket = ws

          ws.onopen = () => {
            isConnecting = false
            console.log("Notifications WebSocket connected successfully")
          }

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data)
              
              // Handle NEW_QUIZ notification
              if (data.type === "NEW_QUIZ") {
                // Data should now be the quiz object directly (not double-encoded)
                let quiz = data.data
                
                // Handle case where data might still be a string (backward compatibility)
                if (typeof quiz === 'string') {
                  try {
                    quiz = JSON.parse(quiz)
                    // If it was double-encoded, extract the nested data
                    if (quiz.data) {
                      quiz = quiz.data
                    }
                  } catch (e) {
                    console.error("Failed to parse quiz data:", e)
                    return
                  }
                }
                
                // Validate quiz object has required fields
                if (!quiz || !quiz.title) {
                  console.error("Invalid quiz data received:", quiz)
                  return
                }
                
                const newNotification: Notification = {
                  id: Math.random().toString(36).substr(2, 9),
                  type: "quiz",
                  title: "New Quiz Available!",
                  message: `"${quiz.title}" is now live. Challenge yourself!`,
                  timestamp: "Just now",
                  read: false,
                  icon: <div className="p-2 bg-primary/20 rounded-lg"><Bell className="w-4 h-4 text-primary" /></div>
                }

                setNotifications(prev => [newNotification, ...prev])
                
                toast.success("New Quiz Available!", {
                  description: `"${quiz.title}" has been added.`,
                  action: {
                    label: "View",
                    onClick: () => window.location.href = "/dashboard"
                  }
                })
              }
            } catch (err) {
              console.error("Error processing WebSocket message:", err)
              // Ignore parse errors for leaderboard data which might be a plain array
            }
          }

          ws.onerror = (event) => {
            isConnecting = false
            // WebSocket error events don't provide detailed error info in the event object
            // Check the socket's readyState instead
            const state = socket?.readyState
            if (state === WebSocket.CLOSED || state === WebSocket.CLOSING) {
              console.warn("Notifications WebSocket connection failed or closed")
            } else {
              console.warn("Notifications WebSocket error occurred, state:", state)
            }
          }

          ws.onclose = (event) => {
            isConnecting = false
            socket = null
            
            // Only reconnect if:
            // 1. Component is still mounted
            // 2. It wasn't a normal closure (code 1000) or going away (code 1001)
            // 3. It wasn't manually closed by us
            if (isMounted && event.code !== 1000 && event.code !== 1001) {
              console.log("Notifications WebSocket closed, reconnecting in 5 seconds...")
              reconnectTimeout = setTimeout(connect, 5000)
            } else if (event.code === 1000 || event.code === 1001) {
              console.log("Notifications WebSocket closed normally")
            }
          }
        } catch (err) {
          isConnecting = false
          console.error("Failed to create WebSocket connection:", err)
          // Retry connection after delay
          if (isMounted) {
            reconnectTimeout = setTimeout(connect, 5000)
          }
        }
      }

      // Only connect if we're in the browser (not SSR)
      if (typeof window !== "undefined") {
        connect()
      }

      return () => {
        isMounted = false
        isConnecting = false
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
    }, [])

    const handleMarkAsRead = (id: string) => {
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    }

    const handleClearAll = () => {
      setNotifications([])
    }

    const handleRemove = (id: string) => {
      setNotifications(notifications.filter((n) => n.id !== id))
    }

    return (
      <div className="relative">
        {/* Bell Icon Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-foreground hover:bg-primary/10 rounded-lg transition-all duration-300"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-gradient-to-br from-destructive to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 bg-card border border-border/50 rounded-lg shadow-xl z-50 overflow-hidden backdrop-blur-sm bg-card/95">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30 bg-gradient-to-r from-card/50 to-card/30">
              <div>
                <h3 className="font-bold text-foreground">Notifications</h3>
                <p className="text-xs text-muted-foreground">
                  {unreadCount} unread • {notifications.length} total
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-primary/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications List */}
            {notifications.length > 0 ? (
              <ScrollArea className="h-96">
                <div className="divide-y divide-border/20">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-primary/5 transition-all duration-200 cursor-pointer border-l-4 ${
                        !notification.read
                          ? "border-l-primary bg-primary/5"
                          : "border-l-transparent"
                      }`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="mt-1">{notification.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-foreground text-sm">
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemove(notification.id)
                              }}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground/60 mt-2">
                            {notification.timestamp}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">No notifications</p>
                </div>
              </div>
            )}

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-border/30 flex justify-center">
                <button
                  onClick={handleClearAll}
                  className="text-xs text-primary hover:text-accent transition-colors font-medium"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
