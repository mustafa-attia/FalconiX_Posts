import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <RouterProvider router={routes} />
      <Toaster
        toastOptions={{
          className: "",
          style: {
            border: "1px solid rgba(32, 39, 43, 0.09)",
            padding: "14px 16px",
            color: "#20272b",
            background: "#ffffff",
            boxShadow: "0 16px 40px rgba(32, 39, 43, 0.1)",
            borderRadius: "16px",
          },
        }}
      />
    </>
  );
}
