"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/lib/api/subscription"
import { Loader2 } from "lucide-react"

interface SubscriptionCardProps {
  currentPlan?: string
  isSubscribed?: boolean
}

export function SubscriptionCard({ currentPlan, isSubscribed }: SubscriptionCardProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: "pro" | "enterprise") => {
    try {
      setLoading(plan)
      const { url } = await createCheckoutSession(plan)
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Subscription error:", error)
      // Ideally show toast here
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Pro Plan */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">Pro</h3>
            <p className="text-muted-foreground text-sm">Unlock advanced features</p>
          </div>
          <span className="text-2xl font-bold">$9.99<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
        </div>
        <ul className="space-y-2 mb-6 text-sm">
            <li className="flex items-center gap-2">✓ Unlimited Quizzes</li>
            <li className="flex items-center gap-2">✓ Advanced Analytics</li>
            <li className="flex items-center gap-2">✓ Priority Support</li>
        </ul>
        <Button 
          className="w-full cursor-pointer" 
          variant={isSubscribed && currentPlan === "pro" ? "outline" : "default"}
          disabled={isSubscribed || loading === "pro"}
          onClick={() => handleSubscribe("pro")}
        >
          {loading === "pro" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubscribed && currentPlan === "pro" ? "Current Plan" : "Subscribe to Pro"}
        </Button>
      </div>

      {/* Enterprise Plan */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow bg-primary/5 border-primary/20">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">Enterprise</h3>
            <p className="text-muted-foreground text-sm">For power users</p>
          </div>
          <span className="text-2xl font-bold">$29.99<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
        </div>
         <ul className="space-y-2 mb-6 text-sm">
            <li className="flex items-center gap-2">✓ Everything in Pro</li>
            <li className="flex items-center gap-2">✓ Custom Branding</li>
            <li className="flex items-center gap-2">✓ API Access</li>
        </ul>
        <Button 
          className="w-full cursor-pointer" 
           variant={isSubscribed && currentPlan === "enterprise" ? "outline" : "default"}
           disabled={isSubscribed || loading === "enterprise"}
           onClick={() => handleSubscribe("enterprise")}
        >
          {loading === "enterprise" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubscribed && currentPlan === "enterprise" ? "Current Plan" : "Subscribe to Enterprise"}
        </Button>
      </div>
    </div>
  )
}
