import { Navigate } from "react-router-dom"
import { useAuth } from "./useAuth"
import type { JSX } from "react"
import { getAccessToken } from "../api/http"

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { loading } = useAuth()
  const token = getAccessToken()

  if (loading) return null
  if (!token) return <Navigate to="/login" replace />

  return children
}
