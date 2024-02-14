import { API_URL, DEFAULT_LIMIT } from "@/lib/constants";
import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { FilterString, Product } from "./interfaces";
const NewProductButton = lazy(() => import("./components/NewProductButton"));
const ProductFilter = lazy(() => import("./components/ProductFilter"));
const ProductLimit = lazy(() => import("./components/ProductLimit"));
const ProductSort = lazy(() => import("./components/ProductSort"));
const ProductTable = lazy(() => import("./components/ProductTable"));
const ResetFilter = lazy(() => import("./components/ResetFilter"));
import axios from "axios";

export default function Products() {
  const [filterString, setFilterString] = useState<FilterString>({
    brand: "",
    category: "",
    archived: "",
  });

  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [checkedArchived, setCheckedArchived] = useState<number[]>([]);
  const [checkedCategories, setCheckedCategories] = useState<number[]>([]);
  const [checkedBrands, setCheckedBrands] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [debouncedFilterString, setDebouncedFilterString] = useState<FilterString>({ brand: "", category: "", archived: "" });

  const productAPIURL = useMemo(() => {
    const { brand, category, archived } = filterString;
    return `${API_URL}/products?limit=${limit}&${brand}${category}${archived}`;
  }, [filterString, limit]);

  const filterAmount = useMemo(() => {
    return checkedArchived.length + checkedBrands.length + checkedCategories.length;
  }, [checkedArchived, checkedBrands, checkedCategories]);

  const handleResetFilters = useCallback(() => {
    setFilterString({
      brand: "",
      category: "",
      archived: "",
    });
    setCheckedArchived([]);
    setCheckedCategories([]);
    setCheckedBrands([]);
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
          setProducts(response.data.content);
        } catch (error) {
          console.error("Error fetching products:", error.response?.data?.message || error.message);
          setProducts([]);
        }
      }, 250), // Adjust the debounce delay as needed
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
          {products && <h1 className="text-3xl font-bold w-full">Products ({products.length})</h1>}
          <h2>Manage products for ZENITH store</h2>
        </div>
        {/* Button to create a new project */}
        <Suspense fallback={<div>Loading...</div>}>
          <NewProductButton />
        </Suspense>
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full flex flex-row justify-between gap-1">
          <div className="flex flex-row gap-1.5">
            {/* Product filter button */}
            <Suspense fallback={<div>Loading...</div>}>
              <ProductFilter
                setFilterString={setFilterString}
                filterAmount={filterAmount}
                checkedBrands={checkedBrands}
                setCheckedBrands={setCheckedBrands}
                checkedCategories={checkedCategories}
                setCheckedCategories={setCheckedCategories}
                checkedArchived={checkedArchived}
                setCheckedArchived={setCheckedArchived}
              />
            </Suspense>
            {/* Product sort button */}
            <Suspense fallback={<div>Loading...</div>}>
              <ProductSort />
            </Suspense>
          </div>
          <div className="flex flex-row gap-1.5">
            {/* Reset filters button */}
            <Suspense fallback={<div>Loading...</div>}>
              <ResetFilter onReset={handleResetFilters} filterAmount={filterAmount} />
            </Suspense>
            {/* Product limit button*/}
            <Suspense fallback={<div>Loading...</div>}>
              <ProductLimit setLimit={setLimit} limit={limit} />
            </Suspense>
          </div>
        </div>
        {/* Product table */}
        <Suspense fallback={<div>Loading...</div>}>
          <ProductTable data={products} />
        </Suspense>
      </div>
    </div>
  );
}
