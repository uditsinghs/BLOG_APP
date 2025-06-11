import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Blogs from "./pages/Blogs";

import AuthorLayout from "./pages/Layouts/AuthorLayout";
import Dashboard from "./pages/author/Dashboard";
import CreateBlog from "./pages/author/CreateBlog";

import MainLayout from "./pages/Layouts/MainLayout";
import AdminLayout from "./pages/Layouts/AdminLayout";
import AdminDashboard from "./pages/admin/adminDashboard";

const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoute isAllowed={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute
              isAllowed={isAuthenticated && user?.role === "author"}
              redirectTo="/"
            >
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/blogs",
          element: (
            <ProtectedRoute isAllowed={isAuthenticated}>
              <Blogs />
            </ProtectedRoute>
          ),
        },
        {
          path: "/author",
          element: (
            <ProtectedRoute
              isAllowed={isAuthenticated && user?.role === "author"}
              redirectTo="/"
            >
              <AuthorLayout />
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Dashboard /> },
            { path: "blog/create", element: <CreateBlog /> },
          ],
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute
          isAllowed={isAuthenticated && user?.role === "admin"}
          redirectTo="/"
        >
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [{ index: true, element: <AdminDashboard /> }],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
