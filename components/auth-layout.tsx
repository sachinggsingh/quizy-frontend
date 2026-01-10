import type React from "react"
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
            <span className="text-xl font-bold text-primary-foreground">Q</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">QuizMaster</h1>
          <p className="text-muted-foreground">Master your knowledge, Compete globally</p>
        </div>
        {children}
      </div>
    </div>
  )
}
