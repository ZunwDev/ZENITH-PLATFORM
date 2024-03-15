import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "./index.css";
import Signup from "./pages/auth/access/Signup.tsx";
import Login from "./pages/auth/signin/Signin.tsx";
import Homepage from "./pages/Homepage.tsx";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/toaster.tsx";
import { Orders, Overview, Products, Settings } from "./components/dashboard/index.ts";
import NewProductForm from "./components/dashboard/forms/NewProductForm.tsx";
import EditProductForm from "./components/dashboard/forms/EditProductForm.tsx";
import Header from "./components/global/Header.tsx";

const dashboard = "/:userId/dashboard";
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
    path: `${dashboard}/orders`,
    element: <Orders />,
  },
  {
    path: `${dashboard}/settings`,
    element: <Settings />,
  },
  {
    path: `${dashboard}/overview`,
    element: <Overview />,
  },
  {
    path: `${dashboard}/products`,
    element: <Products />,
  },
  {
    path: `${dashboard}/products/new`,
    element: <NewProductForm />,
  },
  {
    path: `${dashboard}/products/edit/:productId`,
    element: <EditProductForm />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Header />
    <section className="flex flex-col min-w-[360px] h-[100dvh] mx-auto items-center">
      <React.StrictMode>
        <ThemeProvider forcedTheme="light">
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </React.StrictMode>
    </section>
  </>
);
