"use client"

import React from "react"

import { useState } from "react"
import { Bell, X, CheckCircle2, AlertCircle, TrendingUp, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  type: "achievement" | "quiz" | "leaderboard" | "alert"
  title: string
  message: string
  timestamp: string
  read: boolean
  icon: React.ReactNode
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "achievement",
    title: "Achievement Unlocked!",
    message: "You've completed 10 quizzes! You're on fire! 🔥",
    timestamp: "2 minutes ago",
    read: false,
    icon: <Trophy className="w-5 h-5 text-yellow-500" />,
  },
  {
    id: "2",
    type: "leaderboard",
    title: "Leaderboard Update",
    message: "You've moved up 5 positions! You're now #45 globally.",
    timestamp: "1 hour ago",
    read: false,
    icon: <TrendingUp className="w-5 h-5 text-green-500" />,
  },
  {
    id: "3",
    type: "quiz",
    title: "New Quiz Available",
    message: "Advanced TypeScript quiz has been released. Try it now!",
    timestamp: "3 hours ago",
    read: true,
    icon: <AlertCircle className="w-5 h-5 text-blue-500" />,
  },
  {
    id: "4",
    type: "achievement",
    title: "Streak Milestone",
    message: "You've maintained a 7-day streak! Keep it up!",
    timestamp: "1 day ago",
    read: true,
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  },
  {
    id: "5",
    type: "quiz",
    title: "Quiz Reminder",
    message: "You have pending quizzes. Continue learning!",
    timestamp: "2 days ago",
    read: true,
    icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
  },
]

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

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
