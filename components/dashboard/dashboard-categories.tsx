"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CategoryCard } from "@/components/category-cards"
import { DashboardLoading } from "./dashboard-loading"
import { DashboardError } from "./dashboard-error"
import {
  Code2,
  Globe2,
  BrainCircuit,
  Network,
  BookOpen,
} from "lucide-react"

const CATEGORY_METADATA: Record<string, { icon: any, color: string, description: string }> = {
  "Tech": { 
    icon: Code2, 
    color: "bg-blue-500", 
    description: "Web development, AI, and modern software technologies." 
  },
  "Politics": { 
    icon: Globe2, 
    color: "bg-purple-500", 
    description: "Global affairs, governance, and political history." 
  },
  "DSA": { 
    icon: BrainCircuit, 
    color: "bg-emerald-500", 
    description: "Data Structures, Algorithms, and technical problem solving." 
  },
  "Networking": { 
    icon: Network, 
    color: "bg-orange-500", 
    description: "Infrastructure, protocols, and computer networks." 
  },
  "Others": { 
    icon: BookOpen, 
    color: "bg-slate-500", 
    description: "General knowledge and miscellaneous interesting topics." 
  }
}

interface DashboardCategoriesProps {
  categorizedQuizzes: { [key: string]: any[] }
  effectivelyLoading: boolean
  error: string | null
}

export function DashboardCategories({
  categorizedQuizzes,
  effectivelyLoading,
  error,
}: DashboardCategoriesProps) {
  const categories = Object.keys(categorizedQuizzes).length > 0 
    ? Object.keys(categorizedQuizzes) 
    : ["Tech", "Politics", "DSA", "Networking"]

  if (effectivelyLoading) {
    return <DashboardLoading />
  }

  if (error) {
    return <DashboardError error={error} />
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold">Categories</h2>
        <div className="h-[1px] flex-1 bg-border/50" />
        <Link href="/quiz" className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
          View All Quizzes <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const meta = CATEGORY_METADATA[category] || CATEGORY_METADATA["Others"]
          return (
            <CategoryCard
              key={category}
              title={category}
              description={meta.description}
              icon={meta.icon}
              quizCount={categorizedQuizzes[category]?.length || 0}
              color={meta.color}
              index={index}
            />
          )
        })}
      </div>
    </div>
  )
}
