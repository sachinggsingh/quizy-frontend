"use client"

import { LoaderThree } from "@/components/ui/loader"

interface AuthLoadingProps {
  message: string
}

export function AuthLoading({ message }: AuthLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <LoaderThree />
      <p className="text-primary font-bold animate-pulse">{message}</p>
    </div>
  )
}
