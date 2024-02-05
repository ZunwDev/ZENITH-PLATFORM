import {
  ChevronDown,
  DoorClosed,
  DoorOpen,
  Heart,
  List,
  Receipt,
  Search,
  Settings,
  ShoppingCart,
  Undo2,
  UserRound,
} from "lucide-react";
import logo from "../../assets/logo.svg";
import Cookies from "js-cookie";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import ListItem from "../ui/list-item";

function Header() {
  return (
    <header className="h-16 border-b border-border md:min-w-[1280px] min-w-[360px] px-4">
      <nav className="flex justify-between items-center h-full">
        <div className="flex flex-row gap-3 items-center">
          <img src={logo} alt="Your logo" role="img" className="h-12" />
          <p className="text-2xl text-text tracking-widest font-semibold select-none logoClass">SYNTH</p>
        </div>
        <div className="flex md:gap-4 flex-row-reverse">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row gap-1 items-center">
              <UserRound className="w-7 h-7" />
              <p className="hidden md:block">
                Hello, <strong>{Cookies.get("firstName") !== undefined ? Cookies.get("firstName") : "Sign in"}</strong>
              </p>
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                Favorites
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Receipt className="mr-2 h-4 w-4" />
                Orders
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Undo2 className="mr-2 h-4 w-4" />
                Returns
              </DropdownMenuItem>
              <DropdownMenuItem>
                <List className="mr-2 h-4 w-4" />
                Recent Products
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {Cookies.get("firstName") !== undefined ? (
                  <DoorClosed className="mr-2 h-4 w-4" />
                ) : (
                  <DoorOpen className="mr-2 h-4 w-4" />
                )}
                <strong>{Cookies.get("firstName") !== undefined ? "Sign out" : "Sign in"}</strong>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex flex-row gap-1">
                  <ShoppingCart className="w-7 h-7" />
                  <p className="hidden md:block">Cart</p>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="p-4">
                  <ul className="flex flex-col gap-3 pb-4 md:w-[100px] lg:w-[200px] lg:grid-cols-[.75fr_1fr]">
                    <ListItem href="#" title="Product">
                      Product information
                    </ListItem>
                    <ListItem href="#" title="Product">
                      Product information
                    </ListItem>
                    <ListItem href="#" title="Product">
                      Product information
                    </ListItem>
                  </ul>
                  <NavigationMenuLink className="w-full">
                    <Button className="w-full">Go to cart</Button>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="w-[480px] h-10 items-center rounded-md border border-border pl-3 text-sm md:flex hidden">
            <Search />
            <Input
              placeholder="What are you looking for? Ex. Laptop Lenovo"
              className="border-t border-r-0 border-b border-l-0 rounded-none focus-visible:ring-0"
            />
            <Button className="bg-primary text-secondary rounded-tl-none rounded-bl-none">Search</Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
