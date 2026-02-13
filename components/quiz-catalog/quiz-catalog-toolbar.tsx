"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface QuizCatalogToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filter: "new" | "attempted"
  onFilterChange: (filter: "new" | "attempted") => void
  onResetSearch: () => void
}

export function QuizCatalogToolbar({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  onResetSearch,
}: QuizCatalogToolbarProps) {
  return (
    <>
      {/* Streamlined Toolbar Section */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-10 bg-card/30 p-2 rounded-3xl border border-border/40 backdrop-blur-sm shadow-sm ring-1 ring-white/5">
        <div className="flex-1 relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search by title, topic or skill..."
            className="pl-12 h-14 rounded-2xl bg-card border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-base shadow-none"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex p-1.5 gap-1.5 rounded-2xl bg-accent/20 border border-border/50 w-full md:w-auto self-stretch md:self-auto">
          <Button
            onClick={() => onFilterChange("new")}
            variant="ghost"
            className={`flex-1 md:flex-none px-6 h-11 rounded-xl text-sm font-bold transition-all duration-300 ${
              filter === "new"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-accent/40"
            }`}
          >
            New
          </Button>
          <Button
            onClick={() => onFilterChange("attempted")}
            variant="ghost"
            className={`flex-1 md:flex-none px-6 h-11 rounded-xl text-sm font-bold transition-all duration-300 ${
              filter === "attempted"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-accent/40"
            }`}
          >
            Attempted
          </Button>
        </div>
      </div>

      {/* Stats & Results Header */}
      <div className="flex items-center justify-between mb-2 px-2 border-b border-border/10 pb-4">
        <div className="flex items-center gap-2">
        </div>
        {searchQuery && (
          <Button 
            variant="link" 
            onClick={onResetSearch} 
            className="h-auto p-0 text-xs font-bold text-primary hover:no-underline opacity-80 hover:opacity-100 transition-opacity"
          >
            Reset Search
          </Button>
        )}
      </div>
    </>
  )
}
