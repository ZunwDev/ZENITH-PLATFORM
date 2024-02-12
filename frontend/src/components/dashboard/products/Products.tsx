import { API_URL } from "@/lib/constants";
import { Button } from "../../ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { cn, formatDateTime } from "@/lib/utils";
import { applyDiscount } from "../../../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
} from "../../ui/dropdown-menu";
import { ArrowDownUp, ChevronDown, FileDigit, Filter, X } from "lucide-react";
import Cookies from "js-cookie";

const userId = Cookies.get("userId");

interface Product {
  productId: string;
  name: string;
  category: {
    name: string;
  };
  description: string;
  rating: number;
  price: number;
  parsedSpecifications: string;
  quantity: number;
  discount: number;
  brand: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

interface Category {
  name: string;
  productCategoryId: number;
}

interface Brand {
  name: string;
  brandId: number;
}

interface FilterString {
  brand: string;
  category: string;
  archived: string;
}

const productEntries = ["10", "25", "50", "100"];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [filterString, setFilterString] = useState<FilterString>({
    brand: "",
    category: "",
    archived: "",
  });
  const [limit, setLimit] = useState("10");
  const [productAPIURL, setProductAPIURL] = useState(`${API_URL}/products?limit=${limit}&`);
  const [combinedFilterString, setCombinedFilterString] = useState("");
  const [checkedArchived, setCheckedArchived] = useState<number[]>([]);
  const [checkedCategories, setCheckedCategories] = useState<number[]>([]);
  const [checkedBrands, setCheckedBrands] = useState<number[]>([]);
  const [filterAmount, setFilterAmount] = useState(0);

  const getProducts = async (productAPIURL: string) => {
    const response = await fetch(productAPIURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response.url);

    if (response.ok) {
      const data = await response.json();
      return data.content;
    } else {
      const data = await response.json();
      console.error("Error fetching products:", data.message);
      return [];
    }
  };

  const getFilterData = async (filterUrl: string) => {
    const response = await fetch(`${API_URL}/products/${filterUrl}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  };

  const handleFilterChange = useCallback(
    (type: string, id: number, setChecked: Dispatch<SetStateAction<number[]>>) => {
      setChecked((prev: number[]) => {
        const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
        setFilterString((prevFilter) => ({ ...prevFilter, [type]: updated.map((item) => `${type}=${item}&`).join("") }));
        return updated;
      });
    },
    [setFilterString]
  );

  const resetFilters = useCallback(() => {
    setCombinedFilterString("");
    setFilterString({
      brand: "",
      category: "",
      archived: "",
    });
    setCheckedArchived([]);
    setCheckedCategories([]);
    setCheckedBrands([]);
  }, [setCombinedFilterString, setCheckedArchived, setCheckedCategories, setCheckedBrands, setFilterString]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([getFilterData("category"), getFilterData("brand")]);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching categories and brands:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts(productAPIURL);
      setProducts(data);
    };

    fetchData();
  }, [productAPIURL]);

  useEffect(() => {
    const { brand, category, archived } = filterString;
    const combined = `${brand}${category}${archived}`;
    setCombinedFilterString(combined);
    setFilterAmount(checkedArchived.length + checkedBrands.length + checkedCategories.length);
  }, [filterString, checkedArchived, checkedBrands, checkedCategories]);

  useEffect(() => {
    const updateUrl = () => {
      if (combinedFilterString) {
        const updatedUrl = `${API_URL}/products?limit=${limit}&${combinedFilterString}`;
        setProductAPIURL(updatedUrl);
      } else {
        setProductAPIURL(`${API_URL}/products?limit=${limit}&`);
      }
    };

    updateUrl();
  }, [combinedFilterString, limit]);

  return (
    <div className="flex flex-col gap-20">
      <div className="md:px-0 px-4 flex justify-between flex-row border-b pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold w-full">Products ({products.length})</h1>
          <h2>Manage products for ZENITH store</h2>
        </div>
        <Button className="flex flex-row gap-2 items-center justify-center" asChild>
          <a
            href={`/${userId}/dashboard/products/new`}
            onClick={(e) => {
              e.preventDefault();
              window.location.replace(`/${userId}/dashboard/products/new`);
            }}>
            <span className="text-2xl">+</span>New Product
          </a>
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-row justify-between gap-1">
          <div className="flex flex-row gap-1.5">
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
                    <div className="bg-primary px-2 rounded-full flex items-center justify-center text-accent">
                      {filterAmount}
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
                          checked={checkedCategories.includes(item.productCategoryId)}
                          onCheckedChange={() =>
                            handleFilterChange(
                              "category",
                              item.productCategoryId,
                              setCheckedCategories as Dispatch<SetStateAction<number[]>>
                            )
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
          </div>
          <div className="flex flex-row gap-1.5">
            {filterAmount > 0 && (
              <Button variant="link" className="text-destructive" onClick={resetFilters}>
                <X className="size-3 mr-2" />
                Clear filters
              </Button>
            )}
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
          </div>
        </div>
        <Table>
          <TableCaption>
            {products.length > 0 ? "A list of existing products." : "No products found. Try changing/removing filters."}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-start">Name</TableHead>
              <TableHead className="text-end">Category</TableHead>
              <TableHead className="text-end">Description</TableHead>
              <TableHead className="text-end">Rating</TableHead>
              <TableHead className="text-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>Original</TooltipTrigger>
                    <TooltipContent>
                      <p>Original Price</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="text-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>Discounted</TooltipTrigger>
                    <TooltipContent>
                      <p>Discounted Price</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="text-end">Discount</TableHead>
              <TableHead className="text-end">Specifications</TableHead>
              <TableHead className="text-end">Quantity</TableHead>
              <TableHead className="text-end">Brand</TableHead>
              <TableHead className="text-end">Creation Date</TableHead>
              <TableHead className="text-end">Archived?</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((item, index) => (
              <TableRow key={index} className="cursor-pointer">
                <TableCell className="font-bold text-start w-[216px]">{item.name}</TableCell>
                <TableCell className="text-end">{item.category.name}</TableCell>
                <TableCell className="text-ellipsis text-end">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="text-end">
                        {item.description.length > 40 ? `${item.description.slice(0, 40)}...` : item.description}
                      </TooltipTrigger>
                      <TooltipContent>{item.description}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-end">{item.rating}</TableCell>
                <TableCell className="font-bold text-end">${item.price}</TableCell>
                <TableCell className="font-bold text-end">${applyDiscount(item.price, item.discount)}</TableCell>
                <TableCell className="text-end">{item.discount}%</TableCell>
                <TableCell className="text-end">Open to view</TableCell>
                <TableCell className="text-end">{item.quantity}</TableCell>
                <TableCell className="text-end">{item.brand.name}</TableCell>
                <TableCell className="text-end">{formatDateTime(item.createdAt)}</TableCell>
                <TableCell className="text-end">{item.archived ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
