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
import { cn } from "@/lib/utils";
import { Filter, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Brand, Category, Checked, FilterString } from "../interfaces";
import { DebouncedBrandsAndCategories } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProductFilter {
  setFilterString: React.Dispatch<React.SetStateAction<FilterString>>;
  setFilterAmount: React.Dispatch<React.SetStateAction<number>>;
  filterAmount: number;
  checked: Checked;
  setChecked: React.Dispatch<React.SetStateAction<Checked>>;
  data;
}

const FilterCheckboxItems = ({ data, products, checked, handleFilterChange, filterType }) => {
  const getFilteredItemCount = useMemo(
    () => (itemId) => {
      const filteredCount = products.filter((product) => {
        const categoryId = product.category.categoryId;
        const brandId = product.brand.brandId;
        const isCategoryChecked = !checked.category.length || checked.category.includes(categoryId);
        const isBrandChecked = !checked.brand.length || checked.brand.includes(brandId);
        const isFilterTypeMatch = filterType === "brand" ? brandId === itemId : categoryId === itemId;

        return isCategoryChecked && isBrandChecked && isFilterTypeMatch;
      }).length;

      return filteredCount;
    },
    [products, checked, filterType]
  );

  //Show this if no filter is set
  if (Object.keys(checked).every((key) => !checked[key].length)) {
    return data.map((item, index) => {
      const id = item[`${filterType}Id`];
      return (
        <DropdownMenuCheckboxItem
          key={index}
          checked={checked[filterType].includes(id)}
          onCheckedChange={() => handleFilterChange(filterType, id)}>
          {`${item.name} (${item.amount})`}
        </DropdownMenuCheckboxItem>
      );
    });
  }

  //Show this if filter is set
  return data.map((item, index) => {
    const id = item[`${filterType}Id`];
    const filteredItemCount = getFilteredItemCount(id);
    const itemCount = filteredItemCount || item.amount;

    return (
      <DropdownMenuCheckboxItem
        key={index}
        checked={checked[filterType].includes(id)}
        onCheckedChange={() => handleFilterChange(filterType, id)}>
        {`${item.name} (${itemCount})`}
      </DropdownMenuCheckboxItem>
    );
  });
};

export default function ProductFilter({
  setFilterString,
  setFilterAmount,
  filterAmount,
  checked,
  setChecked,
  data,
}: ProductFilter) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brandsNonZero, setBrandsNonZero] = useState<Brand[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);

  const handleFilterChange = useCallback((type: keyof Checked, id: number) => {
    setChecked((prevState) => {
      const updated = prevState[type].includes(id) ? prevState[type].filter((item) => item !== id) : [...prevState[type], id];

      const updatedFilterString = {
        ...prevState,
        [type]: updated,
      };

      const updatedFilterStringValues = updatedFilterString[type].map((item) => `${type}=${item}&`).join("");

      setFilterString((prev) => ({ ...prev, [type]: updatedFilterStringValues }));
      return updatedFilterString;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [categoryData, , brandNonZero] = await DebouncedBrandsAndCategories();
      setCategories(categoryData);
      setBrandsNonZero(brandNonZero);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      if (data) {
        const filteredCategories =
          checked.brand.length > 0
            ? categories.filter((category) =>
                data.some(
                  (product) =>
                    checked.brand.includes(product.brand.brandId) && product.category.categoryId === category.categoryId
                )
              )
            : categories;

        const filteredBrands =
          checked.category.length > 0
            ? brandsNonZero.filter((brand) =>
                data.some(
                  (product) => checked.category.includes(product.category.categoryId) && product.brand.brandId === brand.brandId
                )
              )
            : brandsNonZero;

        setFilteredCategories(filteredCategories);
        setFilteredBrands(filteredBrands);
      }
    };
    filterData();
  }, [data, categories, brandsNonZero, checked]);

  useEffect(() => {
    setFilterAmount(checked.archived.length + checked.brand.length + checked.category.length);
  }, [checked, setFilterAmount]);

  const getFilterAmountLabel = (type: string) => {
    return checked[type].length > 0 && "(" + checked[type].length + ")";
  };

  const checkedIncludes = (type: string, id: number) => {
    return checked[type].includes(id);
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
        <DropdownMenuLabel>Available filters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Brand {getFilterAmountLabel("brand")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <ScrollArea className={brandsNonZero.length > 12 ? "h-96" : "h-fit"}>
                <FilterCheckboxItems
                  data={filteredBrands}
                  checked={checked}
                  products={data}
                  filterType={"brand"}
                  handleFilterChange={handleFilterChange}
                />
              </ScrollArea>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Category {getFilterAmountLabel("category")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <FilterCheckboxItems
                data={filteredCategories}
                checked={checked}
                products={data}
                filterType="category"
                handleFilterChange={handleFilterChange}
              />
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
                onCheckedChange={() => handleFilterChange("archived", 0)}>
                Show Archived Products
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={checkedIncludes("archived", 1)}
                onCheckedChange={() => handleFilterChange("archived", 1)}>
                Show Active Products
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
