import { Logo } from "@/components/global";
import { STORE_NAME } from "@/lib/constants";
import Sidebar from "./Sidebar";

export default function FullSidebar() {
  return (
    <div className="hidden border-r bg-muted/30 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium h-14 border-b lg:h-[60px] lg:px-4 fixed">
            <a href="/" className="flex items-center gap-2 font-semibold justify-center ml-8 w-full h-14 lg:h-[60px]">
              <Logo fillColor="muted-foreground" className="size-6 md:size-8" />
              <p className="md:text-xl sm:text-lg tracking-widest font-semibold select-none font-brunoac">{STORE_NAME}</p>
            </a>
            <Sidebar />
          </nav>
        </div>
      </div>
    </div>
  );
}
