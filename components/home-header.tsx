import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { logoutUser } from "@/lib/features/auth/authSlice"
import { ModeToggle } from "@/components/mode-toggle"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"

export function HomeHeader() {
  const [mounted, setMounted] = useState(false)
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
    window.location.href = "/"
  }

  // Prevent hydration mismatch by returning a consistent initial render
  const renderAuthButtons = () => {
    if (!mounted) {
      return (
        <>
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </>
      )
    }

    if (isAuthenticated) {
      return (
        <>
          <Button variant="ghost" className="hidden sm:flex" onClick={handleLogout}>
            <span>Log Out</span>
          </Button>
          <HoverBorderGradient
            as={Link}
            href="/dashboard"
            containerClassName="rounded-full"
            className="bg-white text-black dark:bg-[#6DC3BB] dark:text-white dark:hover:text-black flex items-center space-x-2"
          >
            <span>Dashboard</span>
          </HoverBorderGradient>
        </>
      )
    }

    return (
      <>
        <Button asChild variant="outline" className="hidden sm:flex">
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/sign-up">Get Started</Link>
        </Button>
      </>
    )
  }

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent">
            <span className="text-lg font-bold text-primary-foreground">Q</span>
          </div>
          <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground">QuizMaster</h1>
            <p className="text-xs text-muted-foreground">Test your knowledge</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-foreground hover:text-primary font-medium transition-colors nav-link pb-1">
            Features
          </Link>
          <Link href="#how-it-works" className="text-foreground hover:text-primary font-medium transition-colors nav-link pb-1">
            How it Works
          </Link>
          <Link href="#testimonials" className="text-foreground hover:text-primary font-medium transition-colors nav-link pb-1">
            Testimonials
          </Link>
          {mounted && isAuthenticated && (
            <Link href="/leaderboard" className="text-foreground hover:text-primary font-medium transition-colors nav-link pb-1">
              Leaderboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          {renderAuthButtons()}
        </div>
      </div>
    </header>
  )
}
