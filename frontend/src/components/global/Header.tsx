import { useGetSessionData } from "@/hooks";
import { STORE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Logo } from ".";
import { Cart, SearchBar, User } from "../header";

export default function Header() {
  const sessionData = useGetSessionData();
  if (!sessionData) return;

  const urlContainsDashboard = window.location.pathname.includes("dashboard");
  const urlContainsAuth = window.location.pathname.includes("auth");

  return (
    <>
      {!urlContainsDashboard && (
        <header className="h-16 border-b px-8 w-full shadow-xl z-[999] fixed md:min-w-[1200px] min-w-[360px] bg-primary text-accent">
          <nav
            className={cn("flex items-center h-full flex-row", {
              "justify-between": !urlContainsDashboard && !urlContainsAuth,
            })}>
            <a className="flex flex-row gap-4 items-center" href="/">
              <Logo />
              <p className="md:text-2xl sm:text-lg sm:block hidden tracking-widest font-semibold select-none font-brunoac">
                {STORE_NAME}
              </p>
            </a>
            {!urlContainsDashboard && !urlContainsAuth ? (
              <div className="flex md:gap-2 flex-row-reverse">
                <User />
                <Cart />
                <SearchBar />
              </div>
            ) : (
              sessionData &&
              !urlContainsAuth &&
              sessionData.isAdmin && (
                <div className="flex flex-row justify-end w-full pl-8">
                  <Menu className="sm:hidden block size-8" />
                  <User />
                </div>
              )
            )}
          </nav>
        </header>
      )}
    </>
  );
}
