"use client"

import { useSignIn } from "@/lib/hooks/useAuth"
import { AuthLoading, AuthForm } from "@/components/auth"

export function SignInForm() {
  const { formData, formError, isSuccess, isLoading, error, handleChange, handleSubmit } = useSignIn()

  if (isSuccess) {
    return <AuthLoading message="Entering MindClash..." />
  }

  return (
    <AuthForm
      title="Welcome Back"
      description="Sign in to your account to continue"
      formData={formData}
      error={error}
      formError={formError}
      isLoading={isLoading}
      onChange={handleChange}
      onSubmit={handleSubmit}
      footerLink={{
        text: "Don't have an account?",
        href: "/sign-up",
        linkText: "Create one",
      }}
      submitText="Sign In"
      loadingText="Signing In..."
    />
  )
}

