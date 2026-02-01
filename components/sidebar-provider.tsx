"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
  isMobileOpen: boolean
  setIsMobileOpen: (value: boolean) => void
  toggleSidebar: () => void
  toggleMobile: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleSidebar = () => setIsCollapsed((prev) => !prev)
  const toggleMobile = () => setIsMobileOpen((prev) => !prev)

  return (
    <SidebarContext.Provider 
      value={{ 
        isCollapsed, 
        setIsCollapsed, 
        isMobileOpen, 
        setIsMobileOpen, 
        toggleSidebar, 
        toggleMobile 
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
