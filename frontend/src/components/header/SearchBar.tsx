import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function SearchBar() {
  return (
    <div className="w-[480px] h-10 items-center rounded-md border text-sm md:flex hidden text-accent-foreground bg-secondary">
      <div className="flex justify-center items-center px-2">
        <Search className="" />
      </div>
      <Input type="search" placeholder="What are you looking for? Ex. Macbook" />
      <Button variant="secondary" className="rounded-tl-none rounded-bl-none">
        Search
      </Button>
    </div>
  );
}
