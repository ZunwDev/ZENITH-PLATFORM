import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default  function SearchBar() {
  return (
    <div className="w-[480px] h-10 items-center rounded-md border border-border pl-3 text-sm md:flex hidden">
      <Search />
      <Input
        placeholder="What are you looking for? Ex. Macbook"
        className="border-t border-r-0 border-b border-l-0 rounded-none focus-visible:ring-0"
      />
      <Button className="bg-primary text-secondary rounded-tl-none rounded-bl-none">Search</Button>
    </div>
  );
}

