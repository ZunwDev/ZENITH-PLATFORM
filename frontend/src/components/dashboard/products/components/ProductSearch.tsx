import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProductSearchProps {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function ProductSearch({ setSearchQuery }: ProductSearchProps) {
  return (
    <>
      <div className="sm:w-80 w-40 h-10 items-center rounded-md border border-border pl-3 text-sm flex">
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
