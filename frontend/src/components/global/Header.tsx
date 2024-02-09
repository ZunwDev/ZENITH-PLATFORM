import { Button } from "../ui/button";
import Cookies from "js-cookie";
import logo from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import { Cart, SearchBar, User } from "../header";

const userId = Cookies.get("userId");
const roleId = Cookies.get("roleId");
const urlPathName = window.location.pathname;
const isAdminDashboard = urlPathName.startsWith(`/${userId}/dashboard`);

const adminButtons: { name: string; goto: string }[] = [
  { name: "Overview", goto: "/overview" },
  { name: "Orders", goto: "/orders" },
  { name: "Products", goto: "/products" },
  { name: "Settings", goto: "/settings" },
];

export default function Header() {
  return (
    <header className="h-16 border-b px-8 w-full bg-background shadow-xl z-[999] fixed md:min-w-[1200px] min-w-[360px]">
      <nav className={cn("flex items-center h-full flex-row", { "justify-between": !isAdminDashboard })}>
        <a className="flex flex-row gap-3 items-center" href="/">
          <img src={logo} alt="logo" role="img" className="md:h-12 h-8 select-none" />
          <p className="md:text-2xl text-lg tracking-widest font-semibold select-none logoClass">SYNTH</p>
        </a>
        {!isAdminDashboard ? (
          <div className="flex md:gap-2 flex-row-reverse">
            {/* User */}
            <User />

            {/* Cart */}
            <Cart />

            {/* Search bar */}
            <SearchBar />
          </div>
        ) : (
          roleId === "2" && (
            <div className="flex flex-row justify-between w-full pl-8">
              <div>
                {adminButtons.map((item, index) => (
                  <Button variant="ghost" key={index} asChild>
                    <a className="font-semibold" href={`/${userId}/dashboard${item.goto}`}>
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
