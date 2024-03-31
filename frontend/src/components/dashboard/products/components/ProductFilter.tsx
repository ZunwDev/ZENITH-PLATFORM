/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { cn, getAmountOfValuesInObjectOfObjects } from "@/lib/utils";
import { ChevronDown, Filter } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Brand, Category, Checked, Status } from "../interfaces";

interface ProductFilter {
  setFilterAmount: React.Dispatch<React.SetStateAction<number>>;
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
}

const FilterCheckboxItems = React.memo(({ data, checked, handleFilterChange, filterType }: CheckboxItems) => {
  const renderCheckboxItem = (amount: number, name: string, id: number) => {
    return amount > 0 && data !== "No data found" ? (
      <DropdownMenuCheckboxItem
        key={name}
        checked={checked[filterType].includes(id)}
        onCheckedChange={() => handleFilterChange(filterType, id)}>
        {`${name} (${amount})`}
      </DropdownMenuCheckboxItem>
    ) : (
      <DropdownMenuCheckboxItem key={name + id}>No data found</DropdownMenuCheckboxItem>
    );
  };

  return data.map((item) => {
    const itemCount = !Object.keys(checked).some((key) => checked[key].length) ? item.amount : data.amount || item.amount;
    return renderCheckboxItem(itemCount, item.name, item[`${filterType}Id`]);
  });
});

export default function ProductFilter({ setFilterAmount, filterAmount, checked, setChecked, amountData }: ProductFilter) {
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
    setFilterAmount(getAmountOfValuesInObjectOfObjects(checked));
  }, [checked, data, setFilterAmount, amountData]);

  const getFilterAmountLabel = (type: string) => {
    return checked[type].length > 0 && "(" + checked[type].length + ")";
  };

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
          getFilterAmountLabel={getFilterAmountLabel}
          checked={checked}
          handleFilterChange={handleFilterChange}
          filterType="brand"
          filteredData={filteredData}
          data={data}
        />
        <CategoryFilterSub
          getFilterAmountLabel={getFilterAmountLabel}
          checked={checked}
          handleFilterChange={handleFilterChange}
          filterType="category"
          filteredData={filteredData}
          data={data}
        />
        <CategoryFilterSub
          getFilterAmountLabel={getFilterAmountLabel}
          checked={checked}
          handleFilterChange={handleFilterChange}
          filterType="status"
          filteredData={filteredData}
          data={data}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CategoryFilterSub({ getFilterAmountLabel, checked, handleFilterChange, filterType, filteredData, data }) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <span>
          {filterType.capitalize()} {getFilterAmountLabel(filterType)}
        </span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {filterType === "brand" && (
            <ScrollArea className={data.brandsNonZero.length > 12 ? "h-96" : "h-fit"}>
              <FilterCheckboxItems
                data={filteredData[filterType] || ["No data found"]}
                checked={checked}
                filterType={filterType}
                handleFilterChange={handleFilterChange}
              />
            </ScrollArea>
          )}
          {filterType !== "brand" && (
            <FilterCheckboxItems
              data={filteredData[filterType] || ["No data found"]}
              checked={checked}
              filterType={filterType}
              handleFilterChange={handleFilterChange}
            />
          )}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
