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
import { cn, debounce, newAbortSignal } from "@/lib/utils";
import { Filter, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Brand, Category, Checked, FilterString } from "../interfaces";
import { API_URL } from "@/lib/constants";
import axios from "axios";

interface ProductFilter {
  setFilterString: (value: FilterString) => void;
  setFilterAmount: (value: number) => void;
  filterAmount: number;
  checked: Checked;
  setChecked: (value: Checked) => void;
}

export default function ProductFilter({ setFilterString, setFilterAmount, filterAmount, checked, setChecked }: ProductFilter) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const handleFilterChange = useCallback((type: keyof Checked, id: number, s: string) => {
    //@ts-expect-error
    setChecked((prevState) => {
      const updated = prevState[type].includes(id) ? prevState[type].filter((item) => item !== id) : [...prevState[type], id];

      const updatedFilterString = {
        ...prevState,
        [type]: updated,
      };

      const updatedFilterStringValues = updatedFilterString[type].map((item) => `${s}=${item}&`).join("");

      //@ts-expect-error
      setFilterString((prev: FilterString) => ({ ...prev, [s]: updatedFilterStringValues }));
      return updatedFilterString;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedFetchFilters = useMemo(
    () =>
      debounce(async () => {
        try {
          const [categoriesResponse, brandsResponse] = await Promise.all([
            axios.get(`${API_URL}/products/category`, {
              signal: newAbortSignal(5000),
            }),
            axios.get(`${API_URL}/products/brand`, {
              signal: newAbortSignal(5000),
            }),
          ]);
          setCategories(categoriesResponse.data);
          setBrands(brandsResponse.data);
        } catch (error) {
          console.error("Error fetching products:", error.response?.data?.message || error.message);
          setCategories([]);
          setBrands([]);
        }
      }, 250),
    []
  );

  const getFilterAmountLabel = (type: string) => {
    return checked[type].length > 0 && "(" + checked[type].length + ")";
  };

  const checkedIncludes = (type: string, id: number) => {
    return checked[type].includes(id);
  };

  useEffect(() => {
    debouncedFetchFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFilterAmount(checked.archived.length + checked.brands.length + checked.categories.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked.archived, checked.brands, checked.categories]);

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
              className={cn("bg-primary size-5 rounded-full flex items-center justify-center text-accent", {
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
            <span>Brand {getFilterAmountLabel("brands")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="h-96 overflow-auto">
              {brands.map((item, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  checked={checkedIncludes("brands", item.brandId)}
                  onCheckedChange={() => handleFilterChange("brands", item.brandId, "brand")}>
                  {item.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Category {getFilterAmountLabel("categories")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {categories.map((item, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  checked={checkedIncludes("categories", item.categoryId)}
                  onCheckedChange={() => handleFilterChange("categories", item.categoryId, "category")}>
                  {item.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Archived {getFilterAmountLabel("archived")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuCheckboxItem
                checked={checkedIncludes("archived", 0)}
                onCheckedChange={() => handleFilterChange("archived", 0, "archived")}>
                Show Archived Products
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={checkedIncludes("archived", 1)}
                onCheckedChange={() => handleFilterChange("archived", 1, "archived")}>
                Show Active Products
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
