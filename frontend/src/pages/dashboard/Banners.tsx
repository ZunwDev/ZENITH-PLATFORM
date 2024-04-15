import { FullSidebar, SheetSidebar } from "@/components/dashboard/components";
import { NewButton, PageHeader } from "@/components/global";
import { User } from "@/components/header";
import { BookPlus } from "lucide-react";

export default function Banners() {
  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <FullSidebar />
        <div className="flex flex-col">
          <div className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <SheetSidebar />
            <div className="ml-auto">
              <User />
            </div>
          </div>
          <main className="flex flex-1 flex-col gap-2 p-4 lg:gap-4 lg:p-6 pt-4">
            <div className="flex items-center justify-between px-4 md:px-0">
              <PageHeader title="Banner Manager" />
            </div>
            <div className="flex md:flex-row flex-wrap md:justify-between items-center xs:px-4 sm:px-0 gap-1.5">
              <NewButton path="banners" icon={<BookPlus />} type="Banner" className="ml-auto" />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
