import { Button } from "../ui/button";
import Cookies from "js-cookie";
import logo from "@/assets/logo.svg";
import { cn } from "@/lib/utils";
import { BASE_URL } from "@/lib/constants";
import { Cart, SearchBar, User } from "../header";

const userId = Cookies.get("userId");
const roleId = Cookies.get("roleId");
const urlPathName = window.location.pathname;
const isAdminDashboard = urlPathName === `/${userId}/dashboard`;

export default function Header() {
  return (
    <header className="h-16 border-b px-8 w-full bg-background shadow-xl z-[999] fixed md:min-w-[1200px] min-w-[360px]">
      <nav className={cn("flex items-center h-full flex-row", { "justify-between": !isAdminDashboard })}>
        <a className="flex flex-row gap-3 items-center" href={BASE_URL}>
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
            <div className="flex pl-8">
              <Button className="font-semibold" variant="ghost">
                Overview
              </Button>
              <Button className="font-semibold" variant="ghost">
                Orders
              </Button>
              <Button className="font-semibold" variant="ghost">
                Products
              </Button>
              <Button className="font-semibold" variant="ghost">
                Settings
              </Button>
            </div>
          )
        )}
      </nav>
    </header>
  );
}
