import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function SearchBar() {
  return (
    <div className="w-[480px] h-10 items-center rounded-md border border-border pl-3 text-sm md:flex hidden">
      <Search />
      <Input type="search" placeholder="What are you looking for? Ex. Macbook" className="" />
      <Button className="bg-primary text-secondary rounded-tl-none rounded-bl-none">Search</Button>
    </div>
  );
}
