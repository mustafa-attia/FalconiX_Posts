import { Navigate } from "react-router-dom";

export default function AuthProtectedRoutes({ children }: { children: React.ReactNode }) {

    let token = localStorage.getItem("token")

    if (token) {
        return <Navigate to="/" />;
    }

  return (
    <>
    {children}
    
    </>
  )
}
