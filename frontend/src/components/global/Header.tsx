import { Button } from "../ui/button";
import Cookies from "js-cookie";
import logo from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import { Cart, SearchBar, User } from "../header";
import { useEffect, useState } from "react";
import { fetchSessionData } from "@/lib/api";
import { SessionData } from "@/lib/interfaces";

const sessionToken = Cookies.get("sessionToken");

const adminButtons: { name: string; goto: string }[] = [
  { name: "Overview", goto: "/overview" },
  { name: "Orders", goto: "/orders" },
  { name: "Products", goto: "/products" },
  { name: "Settings", goto: "/settings" },
];

export default function Header() {
  const [data, setData] = useState<SessionData>({ roleId: "", userId: "", firstName: "", isAdmin: false });
  const urlContainsDashboard = window.location.pathname.includes("dashboard");

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
          "justify-between": !urlContainsDashboard,
        })}>
        <a className="flex flex-row gap-4 items-center" href="/">
          <img src={logo} alt="logo" role="img" className="md:h-12 h-8 select-none" loading="lazy" width={64} height={64} />
          <p className="md:text-2xl text-lg tracking-widest font-semibold select-none logoClass">ZENITH</p>
        </a>
        {!urlContainsDashboard ? (
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
          data.isAdmin && (
            <div className="flex flex-row justify-between w-full pl-8">
              <div>
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
              <User />
            </div>
          )
        )}
      </nav>
    </header>
  );
}
