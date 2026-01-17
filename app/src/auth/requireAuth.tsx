import { Navigate } from "react-router-dom"
import { useAuth } from "./useAuth"
import type { JSX } from "react"

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" replace />

  return children
}
