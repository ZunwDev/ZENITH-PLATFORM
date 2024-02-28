import { useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { API_URL, DEFAULT_LIMIT } from "@/lib/constants";
import { Checked, FilterString, Page, initialCheckedState, initialFilterString } from "./interfaces";
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
import { debounce, newAbortSignal } from "@/lib/utils";
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

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  useAdminCheck();
  // Filter related
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [filterString, setFilterString] = useState<FilterString>(initialFilterString);
  const [debouncedFilterString, setDebouncedFilterString] = useState<FilterString>(initialFilterString);
  const [filterAmount, setFilterAmount] = useState(0);
  const [checked, setChecked] = useState<Checked>(initialCheckedState);
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [pageData, setPageData] = useState<Page>({} as Page);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState("1" || "1");

  // Debounced values
  const [dbcSearch] = useDebounce(searchQuery, 750);
  const [dbcFilterString] = useDebounce(filterString, 250);

  useEffect(() => {
    if (!queryParams.has("page")) {
      queryParams.set("page", "1");
      setCurrentPage("1");
      navigate(`${location.pathname}?${queryParams.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const productAPIURL = useMemo(() => {
    const { brand, category, archived } = dbcFilterString;
    const pageQueryParam = parseInt(queryParams.get("page")) || 1;
    const params = new URLSearchParams({
      limit: limit,
      page: String(pageQueryParam - 1),
      sortBy: sortBy.slice(0, sortBy.indexOf("_")),
      sortDirection: sortBy.slice(sortBy.indexOf("_") + 1, sortBy.length),
      searchQuery: dbcSearch || "",
    });

    return `${API_URL}/products?${params.toString()}&${brand}${category}${archived}`;
  }, [dbcFilterString, limit, sortBy, dbcSearch, queryParams]);

  const handleResetFilters = useCallback(() => {
    setFilterString(initialFilterString);
    setChecked(initialCheckedState);
  }, []);

  const debouncedFetchProducts = useMemo(
    () =>
      debounce(async () => {
        try {
          const response = await axios.get(`${API_URL}/products?limit=${limit}&${productAPIURL}`, {
            signal: newAbortSignal(5000),
          });
          setPageData(response.data);
        } catch (error) {
          console.error("Error fetching products:", error.response?.data?.message || error.message);
          setPageData({} as Page);
        }
      }, 250),
    [limit, productAPIURL]
  );

  useEffect(() => {
    const debouncedFilterString = debounce(filterString, 250);
    if (typeof debouncedFilterString === "object" && debouncedFilterString !== null) {
      setDebouncedFilterString(debouncedFilterString);
    }
  }, [filterString]);

  useEffect(() => {
    debouncedFetchProducts(debouncedFilterString);
  }, [debouncedFetchProducts, debouncedFilterString]);

  const handlePageChange = (page, event) => {
    event.preventDefault();
    queryParams.set("page", page);
    setCurrentPage(page);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  const paginationItems = [];
  for (let i = 1; i <= Math.min(pageData.totalPages || 0, 3); i++) {
    paginationItems.push(
      <PaginationItem key={i} className="cursor-pointer">
        <PaginationLink
          href={`?page=${i}`}
          isActive={i === (pageData.number + 1 || 1)}
          onClick={(event) => handlePageChange(i, event)}>
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

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
              setFilterString={setFilterString}
              setFilterAmount={setFilterAmount}
              filterAmount={filterAmount}
              checked={checked}
              setChecked={setChecked}
            />
            <ProductSort sortBy={sortBy} setSortBy={setSortBy} />
            <ProductSearch setSearchQuery={setSearchQuery} />
          </div>
          <div className="flex flex-row gap-1.5 flex-wrap">
            <ResetFilter onReset={handleResetFilters} filterAmount={filterAmount} />
            <ProductLimit setLimit={setLimit} limit={limit} />
          </div>
        </div>
        <ProductTable data={pageData.content} />
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={parseInt(currentPage) <= 1 ? "pointer-events-none opacity-50" : undefined}
                aria-disabled={parseInt(currentPage) === 1}
                tabIndex={parseInt(currentPage) <= 1 ? -1 : undefined}
                href={`?page=${Math.max(1, parseInt(currentPage) - 1)}`}
                onClick={(event) => handlePageChange(Math.max(1, parseInt(currentPage) - 1), event)}
              />
            </PaginationItem>
            {paginationItems}
            <PaginationItem>
              <PaginationNext
                className={parseInt(currentPage) == pageData.totalPages ? "pointer-events-none opacity-50" : undefined}
                aria-disabled={parseInt(currentPage) === pageData.totalPages}
                tabIndex={parseInt(currentPage) >= pageData.totalPages ? -1 : undefined}
                href={`?page=${Math.min(pageData.totalPages, parseInt(currentPage) + 1)}`}
                onClick={(event) => handlePageChange(Math.min(pageData.totalPages, parseInt(currentPage) + 1), event)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
