import { ChevronDown, DoorClosed, DoorOpen, Heart, List, Receipt, Settings, Undo2, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Cookies from "js-cookie";

const firstName = Cookies.get("firstName");

const redirectToSignIn = () => {
  if (firstName === undefined) {
    window.location.href = "http://localhost:5173/auth/signin";
  }
};

const signOut = () => {
  Cookies.remove("firstName");
  Cookies.remove("userId");
  Cookies.remove("roleID");
  window.location.reload();
};

interface MenuItem {
  name: string;
  icon: JSX.Element;
}

const items: MenuItem[] = [
  { name: "Favorites", icon: <Heart className="mr-2 h-4 w-4" /> },
  { name: "Orders", icon: <Receipt className="mr-2 h-4 w-4" /> },
  { name: "Returns", icon: <Undo2 className="mr-2 h-4 w-4" /> },
  { name: "Recent Products", icon: <List className="mr-2 h-4 w-4" /> },
  { name: "Settings", icon: <Settings className="mr-2 h-4 w-4" /> },
];

export default function User() {
  const isLoggedIn = firstName !== undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex flex-row gap-1 items-center hover:bg-accent hover:text-accent-foreground transition rounded-md px-4"
        onClick={isLoggedIn ? undefined : redirectToSignIn}>
        <UserRound className="w-7 h-7" />
        <p className="hidden md:block text-sm">
          Hello, <strong>{isLoggedIn ? firstName! : "Sign in"}</strong>
        </p>
        <ChevronDown className="w-3 h-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[9999]">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem key={item.name} onClick={isLoggedIn ? undefined : redirectToSignIn}>
            {item.icon}
            {item.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={isLoggedIn ? signOut : redirectToSignIn}>
          {isLoggedIn ? <DoorClosed className="mr-2 h-4 w-4" /> : <DoorOpen className="mr-2 h-4 w-4" />}
          <strong>{isLoggedIn ? "Sign Out" : "Sign In"}</strong>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
