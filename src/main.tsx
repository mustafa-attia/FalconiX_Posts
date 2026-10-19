import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthContextProvider from "./context/AuthContext.tsx";
import UserContextProvider from "./context/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <UserContextProvider>

      <StrictMode>
        <App />
      </StrictMode>
      
    </UserContextProvider>
  </AuthContextProvider>,
);
