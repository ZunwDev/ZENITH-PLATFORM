import { useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { API_URL, DEFAULT_LIMIT } from "@/lib/constants";
import { AmountData, Archived, Brand, Category, Checked, Page, initialCheckedState } from "./interfaces";
import {
  NewProductButton,
  ProductFilter,
  ProductLimit,
  ProductSearch,
  ProductSort,
  ProductTable,
  ResetFilter,
} from "./components";
import { useDebounce } from "use-debounce";
import { buildQueryParams, debounce, newAbortSignal } from "@/lib/utils";
import PageHeader from "@/components/global/PageHeader";
import { useAdminCheck } from "@/hooks";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLocation, useNavigate } from "react-router-dom";
import { Chip, ChipGroup, ChipGroupContent, ChipGroupTitle } from "@/components/ui/chip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { fetchFilterData } from "@/lib/api";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  useAdminCheck();

  // Filter related
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [filterAmount, setFilterAmount] = useState(0);
  const [checked, setChecked] = useState<Checked>(initialCheckedState);
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [pageData, setPageData] = useState<Page>({} as Page);
  const [amountData, setAmountData] = useState<AmountData>({} as AmountData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState("1" || "1");
  const [filterData, setFilterData] = useState({
    category: [] as Category[],
    brand: [] as Brand[],
    archived: [] as Archived[],
  });

  // Debounced values
  const [dbcSearch] = useDebounce(searchQuery, 250);

  useEffect(() => {
    if (!queryParams.has("p")) {
      queryParams.set("p", "1");
      setCurrentPage("1");
      navigate(`${location.pathname}?${queryParams.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      archived: checked.archived,
    };

    const queryString = buildQueryParams(paramsObj);
    return queryString;
  }, [checked, limit, sortBy, dbcSearch, queryParams]);

  const handleResetFilters = useCallback(() => {
    setChecked(initialCheckedState);
  }, []);

  const debouncedFetchProducts = useMemo(() => {
    const fetchProductsDebounced = debounce(async () => {
      try {
        // Fetch products data
        const productsResponse = await axios.get(`${API_URL}/products?${productAPIURL}`, {
          signal: newAbortSignal(),
        });

        // Fetch amounts data
        const amountsResponse = await axios.get(`${API_URL}/products/amounts?${productAPIURL}`);

        // Update page data and amount data with fetched data
        setPageData(productsResponse.data);
        setAmountData(amountsResponse.data);
      } catch (error) {
        console.error("Error fetching products:", error.response?.data?.message || error.message);
        setPageData({} as Page);
        setAmountData({} as AmountData);
      }
    }, 250);

    return fetchProductsDebounced;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, productAPIURL]);

  useEffect(() => {
    const fetchData = async () => {
      const [categoryData, brandData, , archivedData] = await fetchFilterData();
      setFilterData({ category: categoryData, brand: brandData, archived: archivedData });
    };

    fetchData();
  }, []);

  useEffect(() => {
    debouncedFetchProducts();
  }, [debouncedFetchProducts]);

  const handlePageChange = useCallback(
    (page, event) => {
      event.preventDefault();
      queryParams.set("p", page);
      setCurrentPage(page);
      navigate(`${location.pathname}?${queryParams.toString()}`);
    },
    [queryParams, navigate, location.pathname]
  );

  const paginationItems = [];
  for (let i = 1; i <= Math.min(pageData.totalPages || 0, 3); i++) {
    paginationItems.push(
      <PaginationItem key={i} className="cursor-pointer">
        <PaginationLink
          href={`?p=${i}`}
          isActive={i === (pageData.number + 1 || 1)}
          onClick={(event) => handlePageChange(i, event)}>
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

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
    <div className="flex flex-col gap-16 mt-32 px-8 pb-64 md:min-w-[1600px] min-w-[360px] max-w-[1600px]">
      <div className="md:px-0 px-4 flex justify-between flex-row border-b pb-4 items-center">
        <PageHeader
          title={`Products (${pageData.totalElements > 0 ? pageData.totalElements : 0})`}
          description="Manage products in the store"
        />
        <NewProductButton />
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-row justify-between gap-1 flex-wrap xs:px-4 sm:px-0">
          <div className="flex flex-row gap-1.5">
            <ProductFilter
              setFilterAmount={setFilterAmount}
              filterAmount={filterAmount}
              checked={checked}
              setChecked={setChecked}
              amountData={amountData}
            />
            <ProductSort sortBy={sortBy} setSortBy={setSortBy} />
            <ProductSearch setSearchQuery={setSearchQuery} />
          </div>
          <ProductLimit setLimit={setLimit} limit={limit} />
        </div>
        {filterAmount > 0 && (
          <ScrollArea className="w-[1600px] overflow-y-hidden whitespace-nowrap pb-4">
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

        <ProductTable data={pageData} />
        {pageData.content && (
          <Pagination className="mt-[-2.5rem] z-50">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={parseInt(currentPage) <= 1 ? "pointer-events-none opacity-50" : undefined}
                  aria-disabled={parseInt(currentPage) === 1}
                  tabIndex={parseInt(currentPage) <= 1 ? -1 : undefined}
                  href={`?p=${Math.max(1, parseInt(currentPage) - 1)}`}
                  onClick={(event) => handlePageChange(Math.max(1, parseInt(currentPage) - 1), event)}
                />
              </PaginationItem>
              {paginationItems}
              <PaginationItem>
                <PaginationNext
                  className={parseInt(currentPage) == pageData.totalPages ? "pointer-events-none opacity-50" : undefined}
                  aria-disabled={parseInt(currentPage) === pageData.totalPages}
                  tabIndex={parseInt(currentPage) >= pageData.totalPages ? -1 : undefined}
                  href={`?p=${Math.min(pageData.totalPages, parseInt(currentPage) + 1)}`}
                  onClick={(event) => handlePageChange(Math.min(pageData.totalPages, parseInt(currentPage) + 1), event)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
