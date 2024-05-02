import { useGetSessionData } from "@/hooks";
import { API_URL, newAbortSignal } from "@/lib/api";
import { BASE_URL } from "@/lib/constants";
import { removeAllCookies } from "@/lib/utils";
import axios from "axios";
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

const items: { name: string; icon: JSX.Element; redirect: boolean; goto: string }[] = [
  { name: "Favorites", icon: <Heart className="size-4" />, redirect: false, goto: "/account/favorites" },
  { name: "Orders", icon: <Receipt className="size-4" />, redirect: true, goto: "/account/orders" },
  { name: "Returns", icon: <Undo2 className="size-4" />, redirect: true, goto: "/account/returns" },
  { name: "Recent Products", icon: <List className="size-4" />, redirect: false, goto: "/account/recent" },
  { name: "Settings", icon: <Settings className="size-4" />, redirect: true, goto: "/account/settings" },
];

export default function User() {
  const sessionData = useGetSessionData();
  const { sessionToken, firstName, isAdmin, userId } = sessionData ? sessionData : "";

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
          Hello, <strong>{sessionToken ? firstName : "Sign in"}</strong>
        </p>
        <ChevronDown className="size-3 group-data-[state=open]:rotate-180 transition duration-200" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[9999]" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        {items.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            <a className="flex flex-row items-center gap-2" href={BASE_URL + item.goto}>
              {item.icon}
              {item.name}
            </a>
          </DropdownMenuItem>
        ))}
        {sessionToken && isAdmin && (
          <>
            <DropdownMenuLabel>Administrator</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <a href={`/${userId}/dashboard/overview`} className="flex flex-row items-center">
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
