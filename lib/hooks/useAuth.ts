import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loginUser, registerUser, clearError } from "@/lib/features/auth/authSlice"
import { toast } from "sonner"

export interface UseSignInReturn {
  formData: { email: string; password: string }
  formError: string
  isSuccess: boolean
  isLoading: boolean
  error: string | null
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export interface UseSignUpReturn {
  formData: { name: string; email: string; password: string }
  formError: string
  isSuccess: boolean
  isLoading: boolean
  error: string | null
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export function useSignIn(): UseSignInReturn {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({ email: "", password: "" })
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

    if (!formData.email || !formData.password) {
      const msg = "Invalid credentials"
      setFormError(msg)
      toast.error(msg)
      setTimeout(() => setFormError(""), 3000)
      setTimeout(() => {
        setFormData({ email: "", password: "" })
      }, 1000)
      return
    }

    const result = await dispatch(loginUser(formData))
    
    if (loginUser.fulfilled.match(result)) {
      toast.success("Signed in successfully!")
      setIsSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } else if (loginUser.rejected.match(result)) {
      const errorMessage = (result.payload as string) || "Invalid credentials"
      toast.error(errorMessage)
      setTimeout(() => {
        setFormData({ email: "", password: "" })
      }, 1000)
    }
  }

  return {
    formData,
    formError,
    isSuccess,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  }
}

export function useSignUp(): UseSignUpReturn {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
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

    if (!formData.name || !formData.email || !formData.password) {
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
      const response = result.payload as any
      if (response.access_token || response.refresh_token) {
        toast.success("Account created successfully! Welcome!")
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        toast.success("Account created successfully! Please sign in.")
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/sign-in")
        }, 1500)
      }
    } else if (registerUser.rejected.match(result)) {
      const errorMessage = (result.payload as string) || "Registration failed"
      toast.error(errorMessage)
      setTimeout(() => {
        setFormData({ name: "", email: "", password: "" })
      }, 1000)
    }
  }

  return {
    formData,
    formError,
    isSuccess,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  }
}
