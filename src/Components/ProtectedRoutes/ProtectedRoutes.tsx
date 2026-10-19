import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children }: { children: React.ReactNode }) {

    let token = localStorage.getItem("token")

    if (!token) {
        return <Navigate to="/auth/login" />;
    }

  return (
    <>
    {children}
    
    </>
  )
}

