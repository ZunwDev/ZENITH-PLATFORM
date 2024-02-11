import { API_URL } from "@/lib/constants";
import { Button } from "../ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import { formatDateTime } from "@/lib/utils";
import { applyDiscount } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
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
} from "../ui/dropdown-menu";
import { ArrowDownUp, ChevronDown, Filter, X } from "lucide-react";

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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [filterString, setFilterString] = useState<FilterString>({
    brand: "",
    category: "",
    archived: "",
  });
  const [productAPIURL, setProductAPIURL] = useState(`${API_URL}/products?limit=10&`);
  const [combinedFilterString, setCombinedFilterString] = useState("");
  const [checkedArchived, setCheckedArchived] = useState<string[]>([]);
  const [checkedCategories, setCheckedCategories] = useState<number[]>([]);
  const [checkedBrands, setCheckedBrands] = useState<number[]>([]);

  const [filterCount, setFilterCount] = useState(0);

  const getProducts = async (productAPIURL: string) => {
    const response = await fetch(productAPIURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response);

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

  const handleArchivedChange = useCallback(
    (archived: string) => {
      setCheckedArchived((prevArchived) => {
        const updatedArchived = prevArchived.includes(archived)
          ? prevArchived.filter((text) => text !== archived)
          : [...prevArchived, archived];

        const updatedFilterPairs = updatedArchived.map((text) => `archived=${text}`);
        const newFilterString = updatedFilterPairs.join("&");
        setFilterString((prevFilter) => ({
          ...prevFilter,
          archived: newFilterString,
        }));

        return updatedArchived;
      });
    },
    [setCheckedArchived, setFilterString]
  );

  const handleCategoryChange = useCallback(
    (id: number) => {
      setCheckedCategories((prevCategories) => {
        const updatedCategories = prevCategories.includes(id)
          ? prevCategories.filter((categoryId) => categoryId !== id)
          : [...prevCategories, id];

        const updatedFilterPairs = updatedCategories.map((categoryId) => `categories=${categoryId}`);
        const newFilterString = updatedFilterPairs.join("&");
        setFilterString((prevFilter) => ({
          ...prevFilter,
          category: newFilterString,
        }));

        return updatedCategories;
      });
    },
    [setCheckedCategories, setFilterString]
  );

  const handleBrandChange = useCallback(
    (id: number) => {
      setCheckedBrands((prevBrands) => {
        const updatedBrands = prevBrands.includes(id) ? prevBrands.filter((brandId) => brandId !== id) : [...prevBrands, id];
        const updatedFilterPairs = updatedBrands.map((brandId) => `brands=${brandId}`);
        const newFilterString = updatedFilterPairs.join("&");
        setFilterString((prevFilter) => ({
          ...prevFilter,
          brand: newFilterString,
        }));
        return updatedBrands;
      });
    },
    [setCheckedBrands, setFilterString]
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
    setFilterCount(checkedArchived.length + checkedBrands.length + checkedCategories.length);
  }, [checkedArchived, checkedBrands, checkedCategories]);

  useEffect(() => {
    const { brand, category, archived } = filterString;
    const combined = `${brand}${category}${archived}`;
    setCombinedFilterString(combined);
  }, [filterString]);

  useEffect(() => {
    const updateUrl = () => {
      if (combinedFilterString) {
        setProductAPIURL((prevUrl) => `${prevUrl}&${combinedFilterString}`);
      } else {
        setProductAPIURL(`${API_URL}/products?limit=10`);
      }
    };

    updateUrl();
  }, [combinedFilterString]);

  return (
    <div className="flex flex-col gap-20">
      <div className="md:px-0 px-4 flex justify-between flex-row border-b pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold w-full">Products ({products.length})</h1>
          <h2>Manage products for ZENITH store</h2>
        </div>
        <Button className="flex flex-row gap-2 items-center justify-center">
          <span className="text-xl">+</span>New Product
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-row justify-between gap-1">
          <div className="flex flex-row gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="group data-[state=open]:bg-accent/50">
                <Button variant="outline" className="flex flex-row gap-1">
                  <Filter className="h-4 w-4" />
                  Filter By
                  <ChevronDown className="w-3 h-3 group-data-[state=open]:rotate-180 transition duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Available Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Brand</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="h-96 overflow-auto">
                      {brands.map((item, index) => (
                        <DropdownMenuCheckboxItem
                          key={index}
                          checked={checkedBrands.includes(item.brandId)}
                          onCheckedChange={() => handleBrandChange(item.brandId)}>
                          {item.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Category</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {categories.map((item, index) => (
                        <DropdownMenuCheckboxItem
                          key={index}
                          checked={checkedCategories.includes(item.productCategoryId)}
                          onCheckedChange={() => handleCategoryChange(item.productCategoryId)}>
                          {item.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Archived</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuCheckboxItem
                        checked={checkedArchived.includes("archived")}
                        onCheckedChange={() => handleArchivedChange("archived")}>
                        Show Archived Products
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem
                        checked={checkedArchived.includes("active")}
                        onCheckedChange={() => handleArchivedChange("active")}>
                        Show Active Products
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="group data-[state=open]:bg-accent/50">
                <Button variant="outline" className="flex flex-row gap-1">
                  <ArrowDownUp className="h-4 w-4" />
                  Sort By
                  <ChevronDown className="w-3 h-3 group-data-[state=open]:rotate-180 transition duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Rating</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup>
                  <DropdownMenuRadioItem value="rating_ascending">Ascending</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="rating_descending">Descending</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuLabel>Original Price</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup>
                  <DropdownMenuRadioItem value="original_ascending">Ascending</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="original_descending">Descending</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuLabel>Discounted Price</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup>
                  <DropdownMenuRadioItem value="discounted_ascending">Ascending</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="discounted_descending">Descending</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuLabel>Quantity</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup>
                  <DropdownMenuRadioItem value="quantity_ascending">Ascending</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="quantity_descending">Descending</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuLabel>Creation Date</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup>
                  <DropdownMenuRadioItem value="quantity_ascending">Newest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="quantity_descending">Oldest</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {filterCount > 0 && (
            <Button variant="link" className="text-destructive" onClick={resetFilters}>
              <X className="w-3 h-3 mr-2" />
              Clear filters ({filterCount})
            </Button>
          )}
        </div>
        <Table>
          <TableCaption>A list of existing products.</TableCaption>
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
