import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import ListItem from "../ui/list-item";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

export default function Cart() {
  return (
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
  );
}
