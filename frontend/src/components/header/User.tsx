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
import removeAllCookies from "@/utils/cookies/removeAllCookies";
const firstName = Cookies.get("firstName");
const roleID = Cookies.get("roleID");

const redirectToSignIn = () => {
  if (firstName === undefined) {
    window.location.href = "http://localhost:5173/auth/signin";
  } else {
    return;
  }
};

const signOut = () => {
  removeAllCookies();
  window.location.reload();
};

interface MenuItem {
  name: string;
  icon: JSX.Element;
  redirect: boolean;
  goto: string;
}

const items: MenuItem[] = [
  { name: "Favorites", icon: <Heart className="mr-2 h-4 w-4" />, redirect: false, goto: "/account/favorites" },
  { name: "Orders", icon: <Receipt className="mr-2 h-4 w-4" />, redirect: true, goto: "/account/orders" },
  { name: "Returns", icon: <Undo2 className="mr-2 h-4 w-4" />, redirect: true, goto: "/account/returns" },
  { name: "Recent Products", icon: <List className="mr-2 h-4 w-4" />, redirect: false, goto: "/account/recent" },
  { name: "Settings", icon: <Settings className="mr-2 h-4 w-4" />, redirect: true, goto: "/account/settings" },
];

export default function User() {
  const isLoggedIn = firstName !== undefined; //firstName is undefined, return false, if else then true
  const isAdmin = roleID === "2";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex flex-row gap-1 items-center hover:bg-accent hover:text-accent-foreground transition-all rounded-md px-4 group data-[state=open]:bg-accent/50"
        onClick={isLoggedIn ? undefined : redirectToSignIn}>
        <UserRound className="w-7 h-7" />
        <p className="hidden md:block text-sm">
          Hello, <strong>{isLoggedIn ? firstName! : "Sign in"}</strong>
        </p>
        <ChevronDown className="w-3 h-3 group-data-[state=open]:rotate-180 transition duration-200" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[9999]">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item, index) => (
          <DropdownMenuItem key={index} asChild>
            <a className="flex flex-row items-center" href={"http://localhost:5173" + item.goto}>
              {item.icon}
              {item.name}
            </a>
          </DropdownMenuItem>
        ))}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Administrator</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <a href="/admin/dashboard" className="flex flex-row items-center">
                <UserRoundCog className="mr-2 h-4 w-4" />
                Dashboard
              </a>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href={!isLoggedIn ? "/auth/signin" : undefined}
            onClick={isLoggedIn ? signOut : undefined}
            className="flex flex-row items-center">
            {isLoggedIn ? (
              <DoorClosed className="mr-2 h-4 w-4 stroke-destructive" />
            ) : (
              <DoorOpen className="mr-2 h-4 w-4 stroke-primary" />
            )}
            <strong className={isLoggedIn ? "text-destructive" : "text-primary"}>{isLoggedIn ? "Sign Out" : "Sign In"}</strong>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
