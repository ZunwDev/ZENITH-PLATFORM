import { FullSidebar, SheetSidebar } from "@/components/dashboard/components";
import {
  NewProductButton,
  ProductExport,
  ProductFilter,
  ProductLimit,
  ProductSearch,
  ProductSort,
  ProductTable,
  ResetFilter,
} from "@/components/dashboard/products/components";
import { PageHeader } from "@/components/global";
import { User } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Chip, ChipGroup, ChipGroupContent, ChipGroupTitle } from "@/components/ui/chip";
import { ScrollBar } from "@/components/ui/scroll-area";
import { putUserToFirstPage, useAdminCheck } from "@/hooks";
import { API_URL, fetchFilterData } from "@/lib/api";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { buildQueryParams, newAbortSignal } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDebounce } from "use-debounce";
import {
  AmountData,
  Brand,
  Category,
  Checked,
  Page,
  Status,
  initialCheckedState,
} from "../../components/dashboard/products/interfaces";

export default function Products() {
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  useAdminCheck();
  putUserToFirstPage();

  // Filter related
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [filterAmount, setFilterAmount] = useState(0);
  const [checked, setChecked] = useState<Checked>(initialCheckedState);
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [pageData, setPageData] = useState<Page>({} as Page);
  const [amountData, setAmountData] = useState<AmountData>({} as AmountData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterData, setFilterData] = useState({
    category: [] as Category[],
    brand: [] as Brand[],
    status: [] as Status[],
  });

  // Debounced values
  const [dbcSearch] = useDebounce(searchQuery, 250);

  const productAPIURL = useMemo(() => {
    const pageQueryParam = parseInt(queryParams.get("p")) || 1;
    const searchQueryParam = queryParams.get("q") || "";
    const paramsObj = {
      limit,
      page: pageQueryParam - 1,
      sortBy: sortBy.slice(0, sortBy.indexOf("_")),
      sortDirection: sortBy.slice(sortBy.indexOf("_") + 1, sortBy.length),
      searchQuery: searchQueryParam || dbcSearch || "",
      brand: checked.brand,
      category: checked.category,
      status: checked.status,
    };

    const queryString = buildQueryParams(paramsObj);
    return queryString;
  }, [checked, limit, sortBy, dbcSearch, queryParams]);

  const handleResetFilters = useCallback(() => {
    setChecked(initialCheckedState);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch filter data
        const [categoryData, brandData, , statusData] = await fetchFilterData();
        setFilterData({ category: categoryData, brand: brandData, status: statusData });
      } catch (error) {
        console.error("Error fetching filter data:", error.response?.data?.message || error.message);
      }
    };

    const fetchProducts = async () => {
      try {
        const productsResponse = await axios.get(`${API_URL}/products?${productAPIURL}`, {
          signal: newAbortSignal(),
        });
        const amountsResponse = await axios.get(`${API_URL}/products/amounts?${productAPIURL}`);

        setPageData(productsResponse.data);
        setAmountData(amountsResponse.data);
      } catch (error) {
        console.error("Error fetching products:", error.response?.data?.message || error.message);
        setPageData({} as Page);
        setAmountData({} as AmountData);
      }
    };

    fetchData();
    fetchProducts();

    return () => {
      // Clean up any resources if necessary
    };
  }, [limit, productAPIURL]);

  const handleChipRemove = useCallback(
    (key, idToRemove) => {
      // Update the checked state
      setChecked((prevChecked) => {
        const updatedChecked = { ...prevChecked };
        updatedChecked[key] = updatedChecked[key].filter((id) => id !== idToRemove);
        return updatedChecked;
      });
    },
    [setChecked]
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <FullSidebar />
      <div className="flex flex-col">
        <div className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <SheetSidebar />
          <div className="ml-auto">
            <User />
          </div>
        </div>
        <main className="flex flex-1 flex-col gap-2 p-4 lg:gap-4 lg:p-6 pt-4">
          <div className="flex items-center justify-between px-4 md:px-0">
            <PageHeader title={`Products (${pageData.totalElements > 0 ? pageData.totalElements : 0})`} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex md:flex-row flex-wrap md:justify-between items-center xs:px-4 sm:px-0 gap-1.5">
              <div className="flex flex-row gap-1.5">
                <ProductFilter
                  setFilterAmount={setFilterAmount}
                  filterAmount={filterAmount}
                  checked={checked}
                  setChecked={setChecked}
                  amountData={amountData}
                />
                <ProductSearch setSearchQuery={setSearchQuery} className="md:flex hidden" />
              </div>
              <div className="flex flex-row gap-1.5">
                <ProductLimit setLimit={setLimit} limit={limit} />
                <ProductSort sortBy={sortBy} setSortBy={setSortBy} />
                <ProductExport data={pageData.content} />
                {pageData.totalElements > 0 && <NewProductButton />}
              </div>
              <ProductSearch setSearchQuery={setSearchQuery} className="md:hidden flex w-full" />
            </div>
            {filterAmount > 0 && (
              <ScrollArea className="w-full overflow-y-hidden whitespace-nowrap">
                {Object.entries(checked)
                  .reverse()
                  .map(([key, value], index) => {
                    if (value.length > 0) {
                      return (
                        <ChipGroup key={index}>
                          <ChipGroupTitle>{key.capitalize()}:</ChipGroupTitle>
                          <ChipGroupContent>
                            {value.map((item, index) => (
                              <Chip key={index} onRemove={() => handleChipRemove(key, item)}>
                                {filterData &&
                                  filterData[key]
                                    .filter((filtered) => filtered[key + "Id"] === item)
                                    .map((filteredItem) => filteredItem.name)}
                              </Chip>
                            ))}
                          </ChipGroupContent>
                        </ChipGroup>
                      );
                    }
                    return null;
                  })}
                <ResetFilter onReset={handleResetFilters} filterAmount={filterAmount} />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </div>
          <div className="flex flex-1 items-start justify-center p-4 rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-2 text-center w-full">
              {pageData?.totalElements === 0 ? (
                <>
                  <h3 className="text-2xl font-bold tracking-tight">You have no products</h3>
                  <p className="text-sm text-muted-foreground">You can start selling as soon as you add a product.</p>
                  <Button className="mt-4">Add Product</Button>
                </>
              ) : (
                <>
                  <ProductTable data={pageData} />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
