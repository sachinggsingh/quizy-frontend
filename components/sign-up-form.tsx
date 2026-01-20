"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { registerUser, clearError } from "@/lib/features/auth/authSlice"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { LoaderThree } from "@/components/ui/loader"

export function SignUpForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({ name: "", email: "", password: "",  })
  const [formError, setFormError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error, dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) dispatch(clearError())
    if (formError) setFormError("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("")

    if (!formData.name || !formData.email || !formData.password ) {
      const msg = "All fields are required"
      setFormError(msg)
      toast.error(msg)
      setTimeout(() => setFormError(""), 3000)
      setTimeout(() => {
        setFormData({ name: "", email: "", password: "" })
      }, 1000)
      return
    }

    if (formData.password.length < 8) {
      const msg = "Password must be at least 8 characters long"
      setFormError(msg)
      toast.error(msg)
      setTimeout(() => setFormError(""), 3000)
      setTimeout(() => {
        setFormData({ name: "", email: "", password: "" })
      }, 1000)
      return
    }

    const result = await dispatch(registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password
    }))

    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created successfully! Redirecting...")
      setIsSuccess(true)
      setTimeout(() => {
        router.push("/sign-in")
      }, 1500)
    } else if (registerUser.rejected.match(result)) {
      const errorMessage = (result.payload as string) || "Registration failed"
      toast.error(errorMessage)
      setTimeout(() => {
        setFormData({ name: "", email: "", password: "" })
      }, 1000)
    }

  }



  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <LoaderThree />
        <p className="text-primary font-bold animate-pulse">Account created! Returning to Sign In...</p>
      </div>
    )
  }

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>Join QuizMaster and start competing today</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || formError) && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error || formError}</div>}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              className="bg-input border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
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
              onChange={handleChange}
              disabled={isLoading}
              className="bg-input border-border/50"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

