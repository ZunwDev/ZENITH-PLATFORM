import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Signup from "./pages/auth/access/Signup.tsx";
import Login from "./pages/auth/signin/Login.tsx";
import Homepage from "./pages/Homepage.tsx";

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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div className="w-screen h-[100dvh] flex items-center justify-center">
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </div>
);
document.getElementsByTagName("html")[0].classList.add("dark");
