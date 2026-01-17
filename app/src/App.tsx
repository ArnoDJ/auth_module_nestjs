import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./auth/AuthProvider"
import { LoginPage } from "./pages/LoginPage"
import { AppLayout } from "./layouts/AppLayout"
import { RequireAuth } from "./auth/requireAuth"
import { PasswordForgetPage } from "./pages/PasswordForgetPage"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/password-forget" element={<PasswordForgetPage/>}/>

          <Route
            path="/"
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
