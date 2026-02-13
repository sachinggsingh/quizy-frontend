import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDashboardData } from "./useDashboardData"

export interface UseQuizCatalogReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredQuizzes: any[]
  effectivelyLoading: boolean
  error: string | null
  filter: "new" | "attempted"
  setFilter: (filter: "new" | "attempted") => void
  clearCategoryFilter: () => void
}

export function useQuizCatalog(): UseQuizCatalogReturn {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryFilter = searchParams.get("category")
  
  const {
    quizzes,
    effectivelyLoading,
    error,
    filter,
    setFilter,
  } = useDashboardData()

  const [searchQuery, setSearchQuery] = useState("")

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (quiz.category && quiz.category.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filter === "attempted" ? quiz.attempted : !quiz.attempted
    const matchesCategory = !categoryFilter || quiz.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const clearCategoryFilter = () => {
    router.push("/quiz")
  }

  return {
    searchQuery,
    setSearchQuery,
    filteredQuizzes,
    effectivelyLoading,
    error,
    filter,
    setFilter,
    clearCategoryFilter,
  }
}
