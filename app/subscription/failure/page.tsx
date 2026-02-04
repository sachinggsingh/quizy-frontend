"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SubscriptionFailurePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <span className="inline-flex items-center justify-center rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Payment cancelled</h1>
          <p className="text-muted-foreground text-sm">
            Your payment was not completed, so your subscription hasn&apos;t been activated. You can try again
            at any time from the settings page.
          </p>
        </div>
        <div className="space-y-3">
          <Button asChild className="w-full cursor-pointer">
            <Link href="/settings">Back to settings</Link>
          </Button>
          <Button asChild variant="outline" className="w-full cursor-pointer">
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

