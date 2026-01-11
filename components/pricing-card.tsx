"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: string[]
  isPopular?: boolean
  isAnnual?: boolean
}

export function PricingCard({
  name,
  price,
  description,
  features,
  isPopular = false,
  isAnnual = false,
}: PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative h-full transition-transform duration-300 ${isPopular ? "lg:scale-105" : ""} ${isHovered ? "scale-105" : ""}`}
    >
      {isHovered && isPopular && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 opacity-100 blur-lg -z-10"></div>
      )}

      <Card
        className={`relative border-2 h-full backdrop-blur-sm transition-all duration-300 ${
          isPopular
            ? "border-primary/60 bg-gradient-to-b from-primary/10 to-accent/5"
            : "border-primary/20 bg-card/50 hover:border-primary/40"
        }`}
      >
        {isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
              Most Popular
            </span>
          </div>
        )}

        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-foreground">{name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-primary">${price}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            {isAnnual && <p className="text-xs text-accent">Save 20% with annual billing</p>}
          </div>

          <Button
            className={`w-full h-11 font-semibold transition-all duration-300 ${
              isPopular
                ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
                : "bg-primary/20 text-primary hover:bg-primary/30 border border-primary/40"
            }`}
          >
            Get Started
          </Button>

          <div className="space-y-3 pt-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent mt-0.5 flex-shrink-0">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
