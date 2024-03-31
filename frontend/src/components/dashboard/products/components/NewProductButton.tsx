import { Button } from "@/components/ui/button";
import { useGetSessionData } from "@/hooks";
import { PackagePlus } from "lucide-react";

export default function NewProductButton() {
  const sessionData = useGetSessionData();
  if (!sessionData) return;

  return (
    <Button className="sm:flex flex-row gap-2 items-center justify-center" asChild>
      <a
        href={`/${sessionData.userId}/dashboard/products/new`}
        onClick={(e) => {
          e.preventDefault();
          window.location.replace(`/${sessionData.userId}/dashboard/products/new`);
        }}>
        <PackagePlus className="size-4" />
        New Product
      </a>
    </Button>
  );
}
