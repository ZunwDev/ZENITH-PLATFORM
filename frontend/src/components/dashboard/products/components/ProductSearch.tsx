import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProductSearchProps {
  setSearchQuery: (value: string) => void;
}

export default function ProductSearch({ setSearchQuery }: ProductSearchProps) {
  return (
    <>
      <div className="w-80 h-10 items-center rounded-md border border-border pl-3 text-sm flex">
        <Search className="size-4" />
        <Input
          type="search"
          placeholder="Search products..."
          className=" rounded-none rounded-tr-md rounded-br-md"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </>
  );
}
