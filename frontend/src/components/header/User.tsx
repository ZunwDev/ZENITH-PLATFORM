import {
  ChevronDown,
  DoorClosed,
  DoorOpen,
  Heart,
  List,
  Receipt,
  Settings,
  Undo2,
  UserRound,
  UserRoundCog,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Cookies from "js-cookie";
import { newAbortSignal, removeAllCookies } from "@/lib/utils";
import { API_URL, BASE_URL } from "@/lib/constants";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchSessionData } from "@/lib/api";
import { SessionData } from "@/lib/interfaces";

const sessionToken = Cookies.get("sessionToken");

const items: { name: string; icon: JSX.Element; redirect: boolean; goto: string }[] = [
  { name: "Favorites", icon: <Heart className="mr-2 size-4" />, redirect: false, goto: "/account/favorites" },
  { name: "Orders", icon: <Receipt className="mr-2 size-4" />, redirect: true, goto: "/account/orders" },
  { name: "Returns", icon: <Undo2 className="mr-2 size-4" />, redirect: true, goto: "/account/returns" },
  { name: "Recent Products", icon: <List className="mr-2 size-4" />, redirect: false, goto: "/account/recent" },
  { name: "Settings", icon: <Settings className="mr-2 size-4" />, redirect: true, goto: "/account/settings" },
];

export default function User() {
  const [data, setData] = useState<SessionData>({ roleId: "", userId: "", firstName: "", isAdmin: false });

  useEffect(() => {
    (async () => {
      try {
        setData(await fetchSessionData(sessionToken));
      } catch (error) {
        return;
      }
    })();
  }, []);

  const logOut = async () => {
    try {
      await axios.delete(`${API_URL}/users/session/delete/${sessionToken}`, { signal: newAbortSignal() });
      removeAllCookies();
    } catch (error) {
      removeAllCookies();
      return;
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="flex flex-row gap-1 items-center hover:bg-accent hover:text-accent-foreground transition-all rounded-md px-4 group data-[state=open]:bg-accent/50">
        <UserRound className="size-7" />
        <p className="hidden md:block text-sm">
          Hello, <strong>{sessionToken ? data && data.firstName : "Sign in"}</strong>
        </p>
        <ChevronDown className="size-3 group-data-[state=open]:rotate-180 transition duration-200" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[9999]" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator className="" />
        {items.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            <a className="flex flex-row items-center" href={BASE_URL + item.goto}>
              {item.icon}
              {item.name}
            </a>
          </DropdownMenuItem>
        ))}
        {sessionToken && data.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Administrator</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <a href={`/${data.userId}/dashboard/overview`} className="flex flex-row items-center">
                <UserRoundCog className="mr-2 size-4" />
                Dashboard
              </a>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={!sessionToken ? "/auth/signin" : undefined}
            onClick={sessionToken ? logOut : undefined}
            className="flex flex-row items-center">
            {sessionToken ? (
              <DoorClosed className="mr-2 size-4 stroke-destructive" />
            ) : (
              <DoorOpen className="mr-2 size-4 stroke-primary" />
            )}
            <strong className={sessionToken ? "text-destructive" : "text-primary"}>
              {sessionToken ? "Sign Out" : "Sign In"}
            </strong>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
