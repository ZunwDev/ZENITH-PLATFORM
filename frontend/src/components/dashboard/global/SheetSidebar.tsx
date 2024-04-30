import { Logo } from "@/components/global";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { STORE_NAME } from "@/lib/constants";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function SheetSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <a href="/" className="flex items-center gap-2 font-semibold justify-center h-14 lg:h-[60px]">
            <Logo fillColor="muted-foreground" className="size-6 md:size-8" />
            <p className="md:text-xl sm:text-lg tracking-widest font-semibold select-none font-brunoac">{STORE_NAME}</p>
          </a>
          <Sidebar className="!flex" />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
