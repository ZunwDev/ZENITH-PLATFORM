import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ProductSearchProps {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function ProductSearch({ setSearchQuery }: ProductSearchProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const handleSearch = (value: string, event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchQuery(value);
    value === "" ? queryParams.delete("q") : queryParams.set("q", value);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  return (
    <>
      <div className="sm:w-80 w-40 h-10 items-center rounded-md border border-border pl-3 text-sm flex">
        <Search className="size-4" />
        <Input
          type="search"
          placeholder="Search products..."
          className=" rounded-none rounded-tr-md rounded-br-md"
          onChange={(e) => handleSearch(e.target.value, e)}
          value={queryParams.get("q") || ""}
        />
      </div>
    </>
  );
}
