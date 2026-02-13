"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface AuthFormProps {
  title: string
  description: string
  formData: {
    name?: string
    email: string
    password: string
  }
  error?: string | null
  formError?: string
  isLoading: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  showNameField?: boolean
  footerLink: {
    text: string
    href: string
    linkText: string
  }
  submitText: string
  loadingText: string
}

export function AuthForm({
  title,
  description,
  formData,
  error,
  formError,
  isLoading,
  onChange,
  onSubmit,
  showNameField = false,
  footerLink,
  submitText,
  loadingText,
}: AuthFormProps) {
  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {(error || formError) && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error || formError}
            </div>
          )}

          {showNameField && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name || ""}
                onChange={onChange}
                disabled={isLoading}
                className="bg-input border-border/50"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={onChange}
              disabled={isLoading}
              className="bg-input border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={onChange}
              disabled={isLoading}
              className="bg-input border-border/50"
            />
          </div>

          {!showNameField && (
            <div className="flex items-center justify-between text-sm">
              <Link href="#" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2"
          >
            {isLoading ? loadingText : submitText}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {footerLink.text}{" "}
          <Link href={footerLink.href} className="text-primary hover:underline font-semibold">
            {footerLink.linkText}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
