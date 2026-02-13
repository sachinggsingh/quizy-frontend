"use client"

import { Suspense } from "react"
import { useQuizCatalog } from "@/lib/hooks/useQuizCatalog"
import {
  QuizCatalogLoading,
  QuizCatalogToolbar,
  QuizCatalogError,
  QuizCatalogEmpty,
  QuizCatalogGrid,
} from "@/components/quiz-catalog"
import { LoaderThree, LoaderFive } from "@/components/ui/loader"

function QuizCatalogContent() {
  const {
    searchQuery,
    setSearchQuery,
    filteredQuizzes,
    effectivelyLoading,
    error,
    filter,
    setFilter,
    clearCategoryFilter,
  } = useQuizCatalog()

  if (effectivelyLoading) {
    return <QuizCatalogLoading />
  }

  const handleClearAll = () => {
    setSearchQuery("")
    clearCategoryFilter()
    setFilter("new")
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <QuizCatalogToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
          onResetSearch={() => setSearchQuery("")}
        />

        {error ? (
          <QuizCatalogError error={error} />
        ) : filteredQuizzes.length === 0 ? (
          <QuizCatalogEmpty onClearAll={handleClearAll} />
        ) : (
          <QuizCatalogGrid quizzes={filteredQuizzes} />
        )}
      </main>
    </div>
  )
}

export default function QuizCatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-6">
        <LoaderThree />
        <LoaderFive text="Preparing Catalog..." />
      </div>
    }>
      <QuizCatalogContent />
    </Suspense>
  )
}