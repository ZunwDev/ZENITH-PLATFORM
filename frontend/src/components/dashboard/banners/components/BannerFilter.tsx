import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getFilterAmountLabel } from "@/lib/utils";
import { ChevronDown, Filter } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { Checked } from "../interfaces";

interface Filter {
  filterAmount: number;
  checked: Checked;
  setChecked: React.Dispatch<React.SetStateAction<Checked>>;
  filteredData: any;
}

interface CheckboxItems {
  checked: Checked;
  handleFilterChange: (id: string, name: string) => void;
  filteredData: any;
}

const FilterCheckboxItems: React.FC<CheckboxItems> = ({ checked, handleFilterChange, filteredData }: CheckboxItems) => {
  const renderCheckboxItem = useCallback(
    (amount: number | undefined, name: string | null, id: string) => {
      return (
        <DropdownMenuCheckboxItem
          key={`${name}${amount}`}
          checked={checked[id]?.includes(name.toLowerCase())}
          onCheckedChange={() => handleFilterChange(id, name.toLowerCase())}>
          {`${name} (${amount})`}
        </DropdownMenuCheckboxItem>
      );
    },
    [checked, handleFilterChange]
  );

  const renderCheckboxItems = useMemo(() => {
    return filteredData?.map((item) => {
      return renderCheckboxItem(item.existingAmount, item.name, item.id);
    });
  }, [filteredData, checked, renderCheckboxItem]);

  return <>{renderCheckboxItems}</>;
};
function CategoryFilterSub({ checked, handleFilterChange, filterType, filteredData }) {
  const FilterCheckboxComponent = (
    <FilterCheckboxItems filteredData={filteredData} checked={checked} handleFilterChange={handleFilterChange} />
  );

  const filterContent = (
    <>
      {filteredData?.length > 12 ? (
        <ScrollArea className="h-96">{FilterCheckboxComponent}</ScrollArea>
      ) : (
        FilterCheckboxComponent
      )}
    </>
  );

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <span>
          {filterType} {getFilterAmountLabel(checked, filterType)}
        </span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>{filterContent}</DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

export default function BannerFilter({ filterAmount, checked, setChecked, filteredData }: Filter) {
  const handleFilterChange = useCallback(
    (id: any, name: string) => {
      setChecked((prevState) => {
        return {
          ...prevState,
          [id]: prevState[id].includes(name)
            ? prevState[id]?.filter((item: string) => item !== name)
            : [...prevState[id], name],
        };
      });
    },
    [setChecked, checked]
  );

  return (
    <>
      {filteredData && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild className="group">
            <Button
              variant="outline"
              className={cn("flex flex-row gap-1 transition-all", {
                "bg-primary/10 border-primary transition-all duration-100": filterAmount > 0,
              })}>
              <Filter className="size-4" />
              Filter By
              {filterAmount > 0 && (
                <div
                  className={cn("bg-primary size-4 rounded-full text-xs flex items-center justify-center text-accent", {
                    "px-4": filterAmount > 9,
                  })}>
                  {filterAmount > 99 ? "99+" : filterAmount}
                </div>
              )}
              <ChevronDown className="size-3 group-data-[state=open]:rotate-180 transition duration-200" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            onCloseAutoFocus={(e) => e.preventDefault()}
            className={cn("w-32", { "w-36": filterAmount > 0 })}>
            <DropdownMenuLabel>Available filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {filteredData.filters.map((item, i) => (
              <CategoryFilterSub
                key={i}
                filteredData={item?.filterable}
                checked={checked}
                handleFilterChange={handleFilterChange}
                filterType={item?.filterName}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
