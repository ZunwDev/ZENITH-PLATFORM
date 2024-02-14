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
import { cn } from "@/lib/utils";
import { Filter, ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { Brand, Category, FilterString } from "../interfaces";
import { API_URL } from "@/lib/constants";
import axios from "axios";

interface ProductFilter {
  setFilterString: (value: FilterString) => void;
  filterAmount: number;
  checkedBrands: number[];
  setCheckedBrands: (value: number[]) => void;
  checkedCategories: number[];
  setCheckedCategories: (value: number[]) => void;
  checkedArchived: number[];
  setCheckedArchived: (value: number[]) => void;
}

export default function ProductFilter({
  setFilterString,
  filterAmount,
  checkedBrands,
  setCheckedBrands,
  checkedCategories,
  setCheckedCategories,
  checkedArchived,
  setCheckedArchived,
}: ProductFilter) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const handleFilterChange = useCallback(
    (type: string, id: number, setChecked: Dispatch<SetStateAction<number[]>>) => {
      setChecked((prev: number[]) => {
        const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        setFilterString((prevFilter) => ({ ...prevFilter, [type]: updated.map((item) => `${type}=${item}&`).join("") }));
        return updated;
      });
    },
    [setFilterString]
  );

  const debounce = useCallback((fn, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }, []);

  const debouncedFetchFilters = useMemo(
    () =>
      debounce(async () => {
        try {
          const [categoriesResponse, brandsResponse] = await Promise.all([
            axios.get(`${API_URL}/products/category`),
            axios.get(`${API_URL}/products/brand`),
          ]);
          setCategories(categoriesResponse.data);
          setBrands(brandsResponse.data);
        } catch (error) {
          console.error("Error fetching products:", error.response?.data?.message || error.message);
          setCategories([]);
          setBrands([]);
        }
      }, 250),
    [debounce]
  );

  useEffect(() => {
    debouncedFetchFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              className={cn("bg-primary size-5 rounded-full flex items-center justify-center", {
                "px-4": filterAmount > 9,
              })}>
              {filterAmount > 99 ? "99+" : filterAmount}
            </div>
          )}
          <ChevronDown className="size-3 group-data-[state=open]:rotate-180 transition duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>Available Filters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Brand {checkedBrands.length > 0 && "(" + checkedBrands.length + ")"}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="h-96 overflow-auto">
              {brands.map((item, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  checked={checkedBrands.includes(item.brandId)}
                  onCheckedChange={() =>
                    handleFilterChange("brand", item.brandId, setCheckedBrands as Dispatch<SetStateAction<number[]>>)
                  }>
                  {item.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Category {checkedCategories.length > 0 && "(" + checkedCategories.length + ")"}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {categories.map((item, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  checked={checkedCategories.includes(item.categoryId)}
                  onCheckedChange={() =>
                    handleFilterChange("category", item.categoryId, setCheckedCategories as Dispatch<SetStateAction<number[]>>)
                  }>
                  {item.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Archived {checkedArchived.length > 0 && "(" + checkedArchived.length + ")"}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuCheckboxItem
                checked={checkedArchived.includes(0)}
                onCheckedChange={() =>
                  handleFilterChange("archived", 0, setCheckedArchived as Dispatch<SetStateAction<number[]>>)
                }>
                Show Archived Products
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={checkedArchived.includes(1)}
                onCheckedChange={() =>
                  handleFilterChange("archived", 1, setCheckedArchived as Dispatch<SetStateAction<number[]>>)
                }>
                Show Active Products
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
