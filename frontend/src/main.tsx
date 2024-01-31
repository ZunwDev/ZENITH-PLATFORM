import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Signup from "./pages/auth/access/Signup.tsx";
import Login from "./pages/auth/signin/Login.tsx";

const router = createBrowserRouter([
  {
    path: "/auth/access",
    element: <Signup />,
  },
  {
    path: "/auth/signin",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
document.getElementsByTagName("html")[0].classList.add("dark");
