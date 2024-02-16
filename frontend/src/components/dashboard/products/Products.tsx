import { useState, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { API_URL, DEFAULT_LIMIT } from "@/lib/constants";
import { Checked, FilterString, Page, initialCheckedState } from "./interfaces";
import { NewProductButton, ProductFilter, ProductLimit, ProductSort, ProductTable, ResetFilter } from "./components";

export default function Products() {
  const [filterString, setFilterString] = useState<FilterString>({
    brand: "",
    category: "",
    archived: "",
  });
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [debouncedFilterString, setDebouncedFilterString] = useState<FilterString>({} as FilterString);
  const [filterAmount, setFilterAmount] = useState(0);
  const [checked, setChecked] = useState<Checked>(initialCheckedState);
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [pageData, setPageData] = useState<Page>({} as Page);

  const productAPIURL = useMemo(() => {
    const { brand, category, archived } = filterString;
    return `${API_URL}/products?limit=${limit}&sortBy=${sortBy.slice(0, sortBy.indexOf("_"))}&sortDirection=${sortBy.slice(
      sortBy.indexOf("_") + 1,
      sortBy.length
    )}&${brand}${category}${archived}`;
  }, [filterString, limit, sortBy]);

  const handleResetFilters = useCallback(() => {
    setFilterString({
      brand: "",
      category: "",
      archived: "",
    });
    setChecked(initialCheckedState);
  }, []);

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

  const debouncedFetchProducts = useMemo(
    () =>
      debounce(async () => {
        try {
          const response = await axios.get(`${API_URL}/products?limit=${limit}&${productAPIURL}`);
          setPageData(response.data);
        } catch (error) {
          console.error("Error fetching products:", error.response?.data?.message || error.message);
          setPageData({} as Page);
        }
      }, 250),
    [debounce, limit, productAPIURL]
  );

  useEffect(() => {
    const debouncedFilterString = debounce(filterString, 250);
    if (typeof debouncedFilterString === "object" && debouncedFilterString !== null) {
      setDebouncedFilterString(debouncedFilterString);
    }
  }, [filterString, debounce]);

  useEffect(() => {
    debouncedFetchProducts(debouncedFilterString);
  }, [debouncedFetchProducts, debouncedFilterString]);

  return (
    <div className="flex flex-col gap-20">
      <div className="md:px-0 px-4 flex justify-between flex-row border-b pb-4">
        <div className="flex flex-col gap-1">
          {pageData && <h1 className="text-3xl font-bold w-full">Products ({pageData.totalElements})</h1>}
          <h2>Manage products for ZENITH store</h2>
        </div>
        {/* Button to create a new project */}
        <NewProductButton />
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-row justify-between gap-1">
          <div className="flex flex-row gap-1.5">
            {/* Product filter button */}
            <ProductFilter
              setFilterString={setFilterString}
              setFilterAmount={setFilterAmount}
              filterAmount={filterAmount}
              checked={checked}
              setChecked={setChecked}
            />
            {/* Product sort button */}
            <ProductSort sortBy={sortBy} setSortBy={setSortBy} />
          </div>
          <div className="flex flex-row gap-1.5">
            {/* Reset filters button */}
            <ResetFilter onReset={handleResetFilters} filterAmount={filterAmount} />
            {/* Product limit button*/}
            <ProductLimit setLimit={setLimit} limit={limit} />
          </div>
        </div>
        {/* Product table */}
        <ProductTable data={pageData.content} />
      </div>
    </div>
  );
}
