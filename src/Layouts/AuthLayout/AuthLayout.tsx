import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import AuthIntro from "../../Components/AppIntro/AppIntro"

export default function AuthLayout() {
  const location = useLocation()
  const [mode, setMode] = useState<"login" | "register">("login")
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname.endsWith("/register") || location.pathname === "/auth/register") {
      setMode("register")
    } else {
      setMode("login")
    }
  }, [location.pathname])

  const handleModeChange = (newMode: "login" | "register") => {
    setMode(newMode)

    if (newMode === "login") {
      navigate("/auth/login")
    } else {
      navigate("/auth/register")
    }
  }

  return (
    <main className="min-h-screen bg-[color:var(--page-bg)] px-4 py-8 sm:px-6 sm:py-12 lg:flex lg:items-center">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">
        <div className="w-full lg:flex-1">
          <AuthIntro />
        </div>

        <section className="w-full max-w-md lg:w-[28rem] lg:shrink-0">
          <div className="rounded-[24px] border border-[color:var(--line)] bg-white p-2 shadow-[var(--shadow)]">
            <div className="grid grid-cols-2 rounded-[18px] bg-[color:var(--panel)] p-1">
              <button
                type="button"
                onClick={() => handleModeChange("login")}
                className={`rounded-[14px] px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  mode === "login"
                    ? "bg-[color:var(--primary)] text-white shadow-sm"
                    : "text-[color:var(--muted)] hover:text-[color:var(--text)]"
                }`}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("register")}
                className={`rounded-[14px] px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  mode === "register"
                    ? "bg-[color:var(--primary)] text-white shadow-sm"
                    : "text-[color:var(--muted)] hover:text-[color:var(--text)]"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          <div className="premium-card mt-5 p-6 sm:p-8">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  )
}