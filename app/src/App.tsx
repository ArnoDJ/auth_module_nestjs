import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./auth/AuthProvider"
import { LoginPage } from "./pages/LoginPage"
import { AppLayout } from "./layouts/AppLayout"
import { RequireAuth } from "./auth/requireAuth"
import { PasswordForgetPage } from "./pages/PasswordForgetPage"
import { DashboardPage } from "./pages/DashboardPage"
import { ProjectsPage } from "./pages/ProjectsPage"
import { EmployeesPage } from "./pages/EmployeesPage"
import { RegisterPage } from "./pages/RegisterPage"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/password-forget" element={<PasswordForgetPage/>}/>

          <Route
            path="/"
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="employees" element={<EmployeesPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
