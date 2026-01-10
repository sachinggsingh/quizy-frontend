import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HomeHeader() {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-50">
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
          <Link href="#features" className="text-foreground hover:text-primary font-medium transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-foreground hover:text-primary font-medium transition-colors">
            How it Works
          </Link>
          <Link href="#testimonials" className="text-foreground hover:text-primary font-medium transition-colors">
            Testimonials
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="border-border/50 bg-transparent hidden sm:flex">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
