"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { 
  LayoutDashboard, 
  Trophy, 
  User, 
  MessageSquare, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Settings,
  BookOpen,
  Brain,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/lib/hooks"
import { logoutUser } from "@/lib/features/auth/authSlice"
import { ModeToggle } from "@/components/mode-toggle"
import { PlanBadge } from "./plan-badge"
import { getSubscription } from "@/lib/api/subscription"
import type { PlanType } from "./plan-badge"
import { useSidebar } from "./sidebar-provider"
import { cn } from "@/lib/utils"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Sidebar() {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const [plan, setPlan] = useState<PlanType>("free")
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()

  useEffect(() => {
    getSubscription()
      .then((sub) => {
        if (sub?.status === "active" && (sub?.plan === "pro" || sub?.plan === "enterprise")) {
          setPlan(sub.plan as PlanType)
        } else {
          setPlan("free")
        }
      })
      .catch(() => setPlan("free"))
  }, [])

  // Public routes where sidebar should NOT be visible
  const publicRoutes = ["/", "/sign-in", "/sign-up"]
  if (publicRoutes.includes(pathname)) {
    return null
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    window.location.href = "/"
  }

  const navItems = [
    {label: "Dashboard", href: "/dashboard",icon: LayoutDashboard},
    { label: "Quizzes", href: "/quiz", icon: Brain },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Discussion", href: "/discussion", icon: MessageSquare },
    { label: "Settings", href: "/settings", icon: Settings },
    { label: "Room", href: "/room", icon: Users },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-background/80 backdrop-blur-md shadow-sm"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-[50]"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full bg-card border-r border-border/50 z-[55] transition-all duration-300 ease-in-out flex flex-col",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        {/* <div className="h-20 flex items-center px-6 border-b border-border/10">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">Q</span>
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-foreground whitespace-nowrap">
                MindClash
              </span>
            )}
          </div>
        </div> */}

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar">
      <TooltipProvider delayDuration={0}>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link 
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center rounded-xl transition-all duration-200 group relative",
                      isCollapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-2.5",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "" : "group-hover:scale-110 transition-transform")} />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {isActive && !isCollapsed && (
                      <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" sideOffset={10}>
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </div>

      </TooltipProvider>
        </nav>

        {/* Footer Section */}
        <div className="px-3 py-6 space-y-4 border-t border-border/10">
          <div className={cn(
            "flex flex-col gap-3",
            isCollapsed ? "items-center" : "px-3"
          )}>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className={cn(
                "w-full justify-start gap-3 rounded-xl border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all",
                isCollapsed && "px-0 justify-center h-10 w-10"
              )}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          </div>
        </div>

        {/* Floating Border Toggle (Desktop only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "hidden lg:flex absolute -right-3 top-20 w-6 h-6 items-center justify-center bg-card border border-border rounded-full shadow-md z-[60] text-muted-foreground hover:text-primary hover:border-primary/50 transition-all duration-300",
            "group"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5 group-hover:scale-110" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 group-hover:scale-110" />
          )}
        </button>
      </aside>
    </>
  )
}
