import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownUp, ChevronDown } from "lucide-react";

export default function ProductSort() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="group data-[state=open]:bg-accent/50">
        <Button variant="outline" className="flex flex-row gap-1">
          <ArrowDownUp className="size-4" />
          Sort By
          <ChevronDown className="size-3 group-data-[state=open]:rotate-180 transition duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>Rating</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup>
          <DropdownMenuRadioItem value="rating_ascending">Ascending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="rating_descending">Descending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Original Price</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup>
          <DropdownMenuRadioItem value="original_ascending">Ascending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="original_descending">Descending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Discounted Price</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup>
          <DropdownMenuRadioItem value="discounted_ascending">Ascending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="discounted_descending">Descending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Quantity</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup>
          <DropdownMenuRadioItem value="quantity_ascending">Ascending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="quantity_descending">Descending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Creation Date</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup>
          <DropdownMenuRadioItem value="quantity_ascending">Newest</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="quantity_descending">Oldest</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
