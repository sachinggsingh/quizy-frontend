"use client"

import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <span className="inline-flex items-center justify-center rounded-full bg-emerald-500/10 p-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Subscription successful</h1>
          <p className="text-muted-foreground text-sm">
            Thank you for subscribing! Your payment was processed successfully. Your account will reflect
            your new plan in a moment.
          </p>
        </div>
        <div className="space-y-3">
          <Button asChild className="w-full cursor-pointer">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full cursor-pointer">
            <Link href="/settings">Manage subscription</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

