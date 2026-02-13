"use client"

import { useSignUp } from "@/lib/hooks/useAuth"
import { AuthLoading, AuthForm } from "@/components/auth"

export function SignUpForm() {
  const { formData, formError, isSuccess, isLoading, error, handleChange, handleSubmit } = useSignUp()

  if (isSuccess) {
    return <AuthLoading message="Setting up your account..." />
  }

  return (
    <AuthForm
      title="Create Account"
      description="Join MindClash and start competing today"
      formData={formData}
      error={error}
      formError={formError}
      isLoading={isLoading}
      onChange={handleChange}
      onSubmit={handleSubmit}
      showNameField={true}
      footerLink={{
        text: "Already have an account?",
        href: "/sign-in",
        linkText: "Sign In",
      }}
      submitText="Sign Up"
      loadingText="Creating Account..."
    />
  )
}

