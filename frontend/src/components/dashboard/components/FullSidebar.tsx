import { Logo } from "@/components/global";
import { STORE_NAME } from "@/lib/constants";
import { useTheme } from "next-themes";
import Sidebar from "./Sidebar";

export default function FullSidebar() {
  const { resolvedTheme, forcedTheme } = useTheme();
  return (
    <div className="hidden border-r bg-muted/30 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1">
          <nav className="grid items-start text-sm font-medium h-14 lg:w-[279px] w-[219px] border-b lg:h-[60px] fixed">
            <a href="/" className="flex items-center gap-2 font-semibold justify-center h-14 lg:h-[60px]">
              <Logo fillColor={forcedTheme === "dark" ? "white" : "muted-foreground"} className="size-6 md:size-8" />
              <p className="md:text-xl sm:text-lg tracking-widest font-semibold select-none font-brunoac">{STORE_NAME}</p>
            </a>
            <Sidebar />
          </nav>
        </div>
      </div>
    </div>
  );
}
