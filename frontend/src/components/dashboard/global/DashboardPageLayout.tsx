import { User } from "@/components/header";
import { FullSidebar, SheetSidebar } from ".";

export default function DashboardPageLayout({ children }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <FullSidebar />
      <div className="flex flex-col">
        <div className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <SheetSidebar />
          <div className="ml-auto">
            <User />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
