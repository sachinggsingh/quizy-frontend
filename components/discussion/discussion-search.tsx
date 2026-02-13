"use client"

import { Search } from "lucide-react"

interface DiscussionSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function DiscussionSearch({ searchQuery, onSearchChange }: DiscussionSearchProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search discussions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-card/30 border border-border/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300"
        />
      </div>
    </div>
  )
}
