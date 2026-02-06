import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Deprecated: Tokens are now stored in HTTP-only cookies
// This function is kept for backward compatibility but returns null
// Cookies are automatically sent with requests when using credentials: 'include'
export function getAuthToken() {
  // Tokens are now in HTTP-only cookies, not accessible via JavaScript
  // This function is deprecated but kept for compatibility
  return null;
}
