import { API_URL, DEFAULT_LIMIT } from "@/lib/constants";
import { useEffect, useMemo, useState } from "react";
import { Data, FilterString } from "./interfaces";
import { NewProductButton, ProductFilter, ProductLimit, ProductSort, ProductTable, ResetFilter } from "./components";
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
  const [data, setData] = useState<Data>({ products: [], categories: [], brands: [] });

  const productAPIURL = useMemo(() => {
    const { brand, category, archived } = filterString;
    const combined = `${API_URL}/products?limit=${limit}&${brand}${category}${archived}`;
    return combined;
  }, [filterString, limit]);

  const filterAmount = useMemo(() => {
    return checkedArchived.length + checkedBrands.length + checkedCategories.length;
  }, [checkedArchived, checkedBrands, checkedCategories]);

  const getProducts = async (productAPIURL: string) => {
    try {
      const response = await axios.get(productAPIURL);
      return response.data.content;
    } catch (error) {
      console.error("Error fetching products:", error.response?.data?.message || error.message);
      return [];
    }
  };

  const getFilterData = async (filterUrl: string) => {
    try {
      const response = await axios.get(`${API_URL}/products/${filterUrl}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching filter data:", error.response?.data?.message || error.message);
      return [];
    }
  };

  const handleResetFilters = () => {
    setFilterString({
      brand: "",
      category: "",
      archived: "",
    });
    setCheckedArchived([]);
    setCheckedCategories([]);
    setCheckedBrands([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, brandsData, productsData] = await Promise.all([
          getFilterData("category"),
          getFilterData("brand"),
          getProducts(productAPIURL),
        ]);

        setData({
          products: productsData,
          categories: categoriesData,
          brands: brandsData,
        });
      } catch (error) {
        console.error("Error fetching categories, brands, and products:", error);
      }
    };

    fetchData();
  }, [productAPIURL, limit]);

  return (
    <div className="flex flex-col gap-20">
      <div className="md:px-0 px-4 flex justify-between flex-row border-b pb-4">
        <div className="flex flex-col gap-1">
          {data.products && <h1 className="text-3xl font-bold w-full">Products ({data.products.length})</h1>}
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
              filterAmount={filterAmount}
              data={data}
              checkedBrands={checkedBrands}
              setCheckedBrands={setCheckedBrands}
              checkedCategories={checkedCategories}
              setCheckedCategories={setCheckedCategories}
              checkedArchived={checkedArchived}
              setCheckedArchived={setCheckedArchived}
            />

            {/* Product sort button */}
            <ProductSort />
          </div>
          <div className="flex flex-row gap-1.5">
            {/* Reset filters button */}
            <ResetFilter onReset={handleResetFilters} filterAmount={filterAmount} />
            {/* Product limit button*/}
            <ProductLimit setLimit={setLimit} limit={limit} />
          </div>
        </div>
        {/* Product table */}
        <ProductTable data={data} />
      </div>
    </div>
  );
}
