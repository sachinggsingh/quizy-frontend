"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useSidebar } from "@/components/sidebar-provider"
import { cn } from "@/lib/utils"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()
  
  const publicRoutes = ["/", "/sign-in", "/sign-up"]
  const isPublic = publicRoutes.includes(pathname)

  if (isPublic) {
    return (
      <div className="flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}>
          <DashboardHeader />
          <main className="flex-1 w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
