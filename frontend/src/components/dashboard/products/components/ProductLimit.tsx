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
import { FileDigit, ChevronDown } from "lucide-react";

interface ProductLimitProps {
  limit: string;
  setLimit: (value: string) => void;
}

const productEntries = ["10", "25", "50", "100"];

export default function ProductLimit({ setLimit, limit }: ProductLimitProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="group data-[state=open]:bg-accent/50">
        <Button variant="outline" className="flex flex-row gap-1">
          <FileDigit className="size-4" />
          Limit
          <ChevronDown className="size-3 group-data-[state=open]:rotate-180 transition duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>Change limit</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={limit} onValueChange={setLimit}>
          {productEntries.map((item, index) => (
            <DropdownMenuRadioItem key={index} value={`${item}`}>
              {item} Products
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
