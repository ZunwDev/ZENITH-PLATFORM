import { useMemo } from "react";
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
import React from "react";

const sorts = [
  {
    name: "Rating",
    sortOptions: {
      name: "rating",
      asc: "Lowest",
      desc: "Highest",
    },
  },
  {
    name: "Original Price",
    sortOptions: {
      name: "price",
      asc: "Lowest",
      desc: "Highest",
    },
  },
  {
    name: "Quantity",
    sortOptions: {
      name: "quantity",
      asc: "Lowest",
      desc: "Highest",
    },
  },
  {
    name: "Discount",
    sortOptions: {
      name: "discount",
      asc: "Lowest",
      desc: "Highest",
    },
  },
  {
    name: "Creation Date",
    sortOptions: {
      name: "createdAt",
      asc: "Oldest",
      desc: "Newest",
    },
  },
];

export default function ProductSort({ sortBy, setSortBy }) {
  const dropdownMenuItems = useMemo(
    () =>
      sorts.map((item, index) => (
        <React.Fragment key={index}>
          <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioItem value={`${item.sortOptions.name}_asc`}>{item.sortOptions.asc}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={`${item.sortOptions.name}_desc`}>{item.sortOptions.desc}</DropdownMenuRadioItem>
          {index !== sorts.length - 1 && <DropdownMenuSeparator key={`separator-${index}`} />}
        </React.Fragment>
      )),
    []
  );

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
        <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
          {dropdownMenuItems}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
