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
import { ChevronDown, FileDigit } from "lucide-react";

interface LimitProps {
  limit: string;
  setLimit: React.Dispatch<React.SetStateAction<string>>;
  type: string;
}

const entries = ["10", "25", "50", "100"];

export default function Limit({ setLimit, limit, type }: LimitProps) {
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
          {entries.map((item, index) => (
            <DropdownMenuRadioItem key={index} value={`${item}`}>
              {item} {type}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
