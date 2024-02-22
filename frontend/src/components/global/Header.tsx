import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";
import { Cart, SearchBar, User } from "../header";
import { useEffect, useState } from "react";
import { fetchSessionData } from "@/lib/api";
import { SessionData } from "@/lib/interfaces";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";

const sessionToken = Cookies.get("sessionToken");

const adminButtons: { name: string; goto: string }[] = [
  { name: "Dashboard", goto: "/overview" },
  { name: "Orders", goto: "/orders" },
  { name: "Products", goto: "/products" },
  { name: "Settings", goto: "/settings" },
];

export default function Header() {
  const [data, setData] = useState<SessionData>({ roleId: "", userId: "", firstName: "", isAdmin: false });
  const urlContainsDashboard = window.location.pathname.includes("dashboard");
  const urlContainsAuth = window.location.pathname.includes("auth");

  useEffect(() => {
    (async () => {
      try {
        setData(await fetchSessionData(sessionToken));
      } catch (error) {
        return;
      }
    })();
  }, []);

  return (
    <header className="h-16 border-b px-8 w-full shadow-xl z-[999] fixed md:min-w-[1200px] min-w-[360px] bg-background">
      <nav
        className={cn("flex items-center h-full flex-row", {
          "justify-between": !urlContainsDashboard && !urlContainsAuth,
        })}>
        <a className="flex flex-row gap-4 items-center" href="/">
          <Logo />
          <p className="md:text-2xl sm:text-lg sm:block hidden tracking-widest font-semibold select-none logoClass">ZENITH</p>
        </a>
        {!urlContainsDashboard && !urlContainsAuth ? (
          <div className="flex md:gap-2 flex-row-reverse">
            {/* User */}
            <User />

            {/* Cart */}
            <Cart />

            {/* Search bar */}
            <SearchBar />
          </div>
        ) : (
          data &&
          !urlContainsAuth &&
          data.isAdmin && (
            <div className="flex flex-row sm:justify-between justify-end w-full pl-8">
              <div className="sm:flex hidden">
                {adminButtons.map((item, index) => (
                  <Button variant="ghost" key={index} asChild>
                    <a
                      className="font-semibold cursor-pointer"
                      href={`/${data.userId}/dashboard${item.goto}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.replace(`/${data.userId}/dashboard${item.goto}`);
                      }}>
                      {item.name}
                    </a>
                  </Button>
                ))}
              </div>
              <Menu className="sm:hidden block size-8" />
              <User />
            </div>
          )
        )}
      </nav>
    </header>
  );
}
