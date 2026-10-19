import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });

  function updateToken(token: string | null) {
    setToken(token);

    if (token === null) {
      localStorage.removeItem("token");
      return;
    }

    localStorage.setItem("token", token);
  }

  return (
    <AuthContext.Provider value={{ token, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
}
