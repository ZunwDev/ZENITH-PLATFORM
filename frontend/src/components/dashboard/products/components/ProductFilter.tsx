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
import { fetchFilterData } from "@/lib/api";
import { Brand, Category, Checked, Status } from "@/lib/interfaces";
import { cn, getFilterAmountLabel } from "@/lib/utils";
import { ChevronDown, Filter } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface ProductFilter {
  filterAmount: number;
  checked: Checked;
  setChecked: React.Dispatch<React.SetStateAction<Checked>>;
  amountData;
}

interface CheckboxItems {
  data;
  checked: Checked;
  handleFilterChange: (filterType: string, id: number) => void;
  filterType: string;
  amountData: any;
}

function FilterCheckboxItems({ data, checked, handleFilterChange, filterType, amountData }: CheckboxItems) {
  const renderCheckboxItem = useCallback(
    (amount, name, id) => {
      return amount > 0 && data !== "No data found" ? (
        <DropdownMenuCheckboxItem
          key={name}
          checked={checked[filterType].includes(id)}
          onCheckedChange={() => handleFilterChange(filterType, id)}>
          {`${name} (${amount})`}
        </DropdownMenuCheckboxItem>
      ) : (
        <DropdownMenuCheckboxItem key={name + id} disabled>
          No data found
        </DropdownMenuCheckboxItem>
      );
    },
    [data, checked, filterType, handleFilterChange]
  );

  const renderCheckboxItems = useMemo(() => {
    return (data as { amount?: number; name?: string }[]).map((item) => {
      const itemCount = Object.keys(checked).some((key) => checked[key].length)
        ? item.amount
        : data.amount ||
          item.amount ||
          Object.values(amountData as { amount?: number }[])
            .flatMap((data) => data)
            .find((dataItem) => dataItem[`${filterType}Id`] === item[`${filterType}Id`])?.amount ||
          item.amount;
      return renderCheckboxItem(itemCount, item.name, item[`${filterType}Id`]);
    });
  }, [data, checked, filterType, renderCheckboxItem, amountData]);

  return renderCheckboxItems;
}

function CategoryFilterSub({ checked, handleFilterChange, filterType, filteredData, amountData }) {
  const filteredItems = useMemo(() => filteredData[filterType] || ["No data found"], [filteredData, filterType]);
  const FilterCheckboxComponent = (
    <FilterCheckboxItems
      amountData={amountData}
      data={filteredItems}
      checked={checked}
      filterType={filterType}
      handleFilterChange={handleFilterChange}
    />
  );

  const filterContent = (
    <>
      {filteredItems.length > 12 ? (
        <ScrollArea className={`h-96`}>{FilterCheckboxComponent}</ScrollArea>
      ) : (
        FilterCheckboxComponent
      )}
    </>
  );

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <span>
          {filterType.capitalize()} {getFilterAmountLabel(checked, filterType)}
        </span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>{filterContent}</DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

export default function ProductFilter({ filterAmount, checked, setChecked, amountData }: ProductFilter) {
  const [data, setData] = useState({
    category: [] as Category[],
    brandsNonZero: [] as Brand[],
    status: [] as Status[],
  });
  const [filteredData, setFilteredData] = useState({
    category: [] as Category[],
    brand: [] as Brand[],
    status: [] as Status[],
  });

  const handleFilterChange = useCallback(
    (type: keyof Checked, id: number) => {
      setChecked((prevState) => ({
        ...prevState,
        [type]: prevState[type].includes(id) ? prevState[type].filter((item) => item !== id) : [...prevState[type], id],
      }));
    },
    [setChecked]
  );

  useEffect(() => {
    const fetchData = async () => {
      const [categoryData, , brandNonZero, statusData] = await fetchFilterData();
      setData({ category: categoryData, brandsNonZero: brandNonZero, status: statusData });
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!amountData) return;

    setFilteredData({
      category: checked.brand.length > 0 ? amountData.category : data.category,
      brand: checked.category.length > 0 ? amountData.brand : data.brandsNonZero,
      status: checked.category.length > 0 || checked.brand.length > 0 ? amountData.status : data.status,
    });
  }, [checked, data, amountData]);

  return (
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
      <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()} className={cn("w-32", { "w-36": filterAmount > 0 })}>
        <DropdownMenuLabel>Available filters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <CategoryFilterSub
          amountData={amountData}
          checked={checked}
          handleFilterChange={handleFilterChange}
          filterType="brand"
          filteredData={filteredData}
        />
        <CategoryFilterSub
          amountData={amountData}
          checked={checked}
          handleFilterChange={handleFilterChange}
          filterType="category"
          filteredData={filteredData}
        />
        <CategoryFilterSub
          amountData={amountData}
          checked={checked}
          handleFilterChange={handleFilterChange}
          filterType="status"
          filteredData={filteredData}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
