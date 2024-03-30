import { ThemeProvider } from "next-themes";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Header from "./components/global/Header.tsx";
import { ArrowUpButton } from "./components/global/index.ts";
import { Toaster } from "./components/ui/toaster.tsx";
import { useScrollPosition } from "./hooks/index.ts";
import "./index.css";
import router from "./router/routerSetup.ts";

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
