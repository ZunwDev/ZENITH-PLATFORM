import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "./index.css";
import Signup from "./pages/auth/access/Signup.tsx";
import Login from "./pages/auth/signin/Signin.tsx";
import Homepage from "./pages/Homepage.tsx";
import Header from "./components/global/Header.tsx";
import Dashboard from "./components/dashboard/Dashboard.tsx";

const router = createBrowserRouter([
  {
    path: "/auth/access",
    element: <Signup />,
  },
  {
    path: "/auth/signin",
    element: <Login />,
  },
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: `/:userId/dashboard/:path`,
    element: <Dashboard />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Header />
    <div className="flex flex-col md:min-w-[1200px] min-w-[360px] min-h-[100dvh] max-w-[1200px] mx-auto items-center bg-background">
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </div>
  </>
);
document.getElementById("root")?.classList.add(/* "dark",*/ "bg-background");
