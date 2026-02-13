"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="mb-12">
      <h1 className="text-4xl font-black tracking-tight mb-2">
        Welcome back!
      </h1>
      <p className="text-muted-foreground text-lg">
        Pick a category to sharpen your knowledge or discover something new.
      </p>
    </div>
  )
}
