"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface QuizCatalogEmptyProps {
  onClearAll: () => void
}

export function QuizCatalogEmpty({ onClearAll }: QuizCatalogEmptyProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-32 text-muted-foreground border-2 border-dashed border-border/50 rounded-[3rem] bg-accent/5 max-w-3xl mx-auto"
    >
      <div className="max-w-xs mx-auto space-y-6">
        <div className="w-24 h-24 bg-accent/10 rounded-[2rem] flex items-center justify-center mx-auto rotate-12 group hover:rotate-0 transition-transform duration-500">
          <Search className="w-10 h-10 opacity-30 text-primary" />
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-black text-foreground tracking-tight">Empty result set</p>
          <p className="text-sm opacity-60 leading-relaxed">
            Try adjusting your keywords or switching filters to find what you're looking for.
          </p>
        </div>
        <Button 
          onClick={onClearAll}
          variant="outline" 
          className="rounded-2xl border-border/50 font-bold px-8"
        >
          Clear everything
        </Button>
      </div>
    </motion.div>
  )
}
