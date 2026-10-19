import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout/MainLayout";
import Profile from "../Pages/Profile/Profile";
import Feed from "../Pages/Feed/Feed";
import Notfound from "../Pages/Notfound/Notfound";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
import Login from "../Pages/Auth/login/Login";
import Register from "../Pages/Auth/register/Register";
import Notification from "../Pages/Notification/Notification";
import ProtectedRoutes from "../Components/ProtectedRoutes/ProtectedRoutes";
import AuthProtectedRoutes from "../Components/ProtectedRoutes/AuthProtectedRoute";
import PostDetails from "../Pages/PostDetails/PostDetails";
import SavedPosts from "../Pages/Saved/SavedPosts";
import ChangePassword from "../Pages/Settings/ChangePassword";

export const routes = createBrowserRouter([
  {
    path: "",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { index: true, element: <Feed /> },
      { path: "profile", element: <Profile /> },
      { path: "saved", element: <SavedPosts /> },
      { path: "notification", element: <Notification /> },
      { path: "postDetails/:id", element: <PostDetails /> },
      { path: "settings", element: <ChangePassword /> },
    ],
  },
  {
    path: "auth",
    element: <AuthProtectedRoutes><AuthLayout /></AuthProtectedRoutes>,
    children: [
      { index: true, element: <Navigate to="login" /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  { path: "*", element: <Notfound /> },
]);
