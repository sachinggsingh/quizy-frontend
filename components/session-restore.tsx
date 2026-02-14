"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useAppDispatch } from "@/lib/hooks"
import { fetchProfile } from "@/lib/features/auth/authSlice"

const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up"]

/**
 * Dispatches fetchProfile on mount so session is restored from cookies
 * (e.g. after page refresh). Skips on public routes to avoid hydration
 * mismatch (auth.isLoading would become true and change sign-in form UI).
 */
export function SessionRestore() {
  const dispatch = useAppDispatch()
  const pathname = usePathname()
  useEffect(() => {
    if (pathname == null || PUBLIC_ROUTES.includes(pathname)) return
    dispatch(fetchProfile())
  }, [dispatch, pathname])
  return null
}
