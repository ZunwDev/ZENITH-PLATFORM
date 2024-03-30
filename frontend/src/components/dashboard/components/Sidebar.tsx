import { useGetSessionData } from "@/hooks";
import { cn } from "@/lib/utils";
import { Flag, Folder, Home, Package, Settings, ShoppingCart } from "lucide-react";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

export default function Sidebar({ className = "" }) {
  const location = useLocation();
  const sessionData = useGetSessionData();
  if (!sessionData) return;

  const { pathname } = location;
  const pathParts = pathname.split("/");
  const page = pathParts[pathParts.length - 1];

  const adminButtons: { name: string; goto: string; icon: ReactNode }[] = [
    { name: "Dashboard", goto: "/overview", icon: <Home className="size-4" /> },
    { name: "Orders", goto: "/orders", icon: <ShoppingCart className="size-4" /> },
    { name: "Products", goto: "/products", icon: <Package className="size-4" /> },
    { name: "Banners", goto: "/banner", icon: <Flag className="size-4" /> },
    { name: "Attributes", goto: "/attribute", icon: <Folder className="size-4" /> },
  ];

  return (
    <div className={cn("max-h-screen flex-col gap-2 fixed h-screen mt-16 z-50 hidden md:flex w-64 sm:w-64 xs:w-48", className)}>
      <div className="flex-grow mt-8">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <span className="font-semibold text-muted-foreground">MAIN</span>
          <div className="py-2">
            {adminButtons.map((item, index) => (
              <a
                key={index}
                href={`/${sessionData?.userId}/dashboard${item.goto}`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  page === item.goto.slice(1) ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
                }`}>
                {item.icon}
                {item.name}
              </a>
            ))}
          </div>
          <span className="font-semibold text-muted-foreground">OTHER</span>
          <div className="py-2">
            <a
              href={`/${sessionData?.userId}/dashboard/settings`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                page === "settings" ? "bg-muted-foreground/15 text-primary" : "text-muted-foreground hover:text-primary"
              }`}>
              <Settings className="size-4" />
              Settings
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}
