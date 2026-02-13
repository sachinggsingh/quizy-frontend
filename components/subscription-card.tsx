import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/lib/api/subscription"
import { Loader2, CheckCircle2, Star, Rocket, ShieldCheck } from "lucide-react"

interface SubscriptionCardProps {
  currentPlan?: string
  isSubscribed?: boolean
}

export function SubscriptionCard({ currentPlan, isSubscribed }: SubscriptionCardProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: "pro" | "enterprise") => {
    try {
      setLoading(plan)
      const priceId = plan === "pro" 
        ? process.env.NEXT_PUBLIC_STRIPE_PRO_PLAN_PRICE_ID 
        : process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PLAN_PRICE_ID
      
      const { url } = await createCheckoutSession(plan, priceId)
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Subscription error:", error)
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      description: "Basic features for individuals",
      features: ["5 Quizzes per month", "Basic Analytics", "Community Support", "Public Profile"],
      icon: ShieldCheck,
      color: "border-border",
      highlight: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$9.99",
      description: "Unlock advanced features",
      features: ["Unlimited Quizzes", "Advanced Analytics", "Priority Support", "Detailed Rank Stats"],
      icon: Star,
      color: "border-primary/50 shadow-lg shadow-primary/10",
      highlight: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$29.99",
      description: "For power users & teams",
      features: ["Everything in Pro", "Custom Branding", "API Access", "Dedicated Support"],
      icon: Rocket,
      color: "border-accent/50 bg-accent/5",
      highlight: false,
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
      {plans.map((plan) => {
        const Icon = plan.icon
        const isCurrent = isSubscribed && currentPlan === plan.id
        const isActive = plan.id !== "free"

        return (
          <div 
            key={plan.id}
            className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${plan.color} bg-card/50 backdrop-blur-sm`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Most Popular
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${plan.highlight ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
              </div>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-foreground">{plan.price}</span>
              <span className="text-sm font-medium text-muted-foreground ml-1">/month</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? "text-primary" : "text-muted-foreground"}`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full h-11 rounded-xl font-semibold transition-all duration-300 ${
                isCurrent 
                  ? "bg-transparent border-2 border-primary/50 text-primary hover:bg-primary/10" 
                  : plan.highlight
                    ? "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20"
                    : "bg-card border border-border text-foreground hover:bg-accent/10"
              }`}
              variant={isCurrent ? "outline" : "default"}
              disabled={(isSubscribed && plan.id === "free") || (isActive && loading === plan.id) || (isCurrent)}
              onClick={() => plan.id !== "free" && handleSubscribe(plan.id as "pro" | "enterprise")}
            >
              {loading === plan.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCurrent ? "Current Plan" : plan.id === "free" ? "Default Plan" : `Upgrade to ${plan.name}`}
            </Button>
          </div>
        )
      })}
    </div>
  )
}
