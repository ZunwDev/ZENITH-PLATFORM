import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  type: string;
  className?: string;
  handleSearch?: (s: string, e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ searchQuery, type, className, handleSearch }: SearchBarProps) {
  return (
    <>
      <div className={cn("md:w-80 w-40 h-10 items-center rounded-md border pl-3 text-sm", className)}>
        <Search className="size-4" />
        <Input
          type="search"
          placeholder={`Search ${type}...`}
          className="rounded-none rounded-tr-md rounded-br-md"
          onChange={(e) => handleSearch(e.target.value, e)}
          value={searchQuery || ""}
        />
      </div>
    </>
  );
}
