import { ThemeProvider } from "next-themes";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { EditProductForm, NewProductForm } from "./components/dashboard/forms/index.ts";
import Header from "./components/global/Header.tsx";
import { ArrowUpButton } from "./components/global/index.ts";
import { Toaster } from "./components/ui/toaster.tsx";
import { useScrollPosition } from "./hooks/index.ts";
import "./index.css";
import { Signin, Signup } from "./pages/auth/index.ts";
import { Orders, Overview, Products, Settings } from "./pages/dashboard/index.ts";
import Homepage from "./pages/home/Homepage.tsx";

const dashboard = "/:userId/dashboard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/auth/access",
    element: <Signup />,
  },
  {
    path: "/auth/signin",
    element: <Signin />,
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

const App = () => {
  const showGoToTop = useScrollPosition();

  return (
    <>
      <Header />
      <section className="flex flex-col min-w-[360px] h-[100dvh] mx-auto items-center">
        <React.StrictMode>
          <ThemeProvider forcedTheme="light">
            <RouterProvider router={router}></RouterProvider>
            <Toaster />
          </ThemeProvider>
        </React.StrictMode>
        {showGoToTop && <ArrowUpButton />}
      </section>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
