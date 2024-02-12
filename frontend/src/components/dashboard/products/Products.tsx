import { API_URL, DEFAULT_LIMIT } from "@/lib/constants";
import { useEffect, useState } from "react";
import { Data, FilterString } from "./interfaces";
import { NewProductButton, ProductFilter, ProductLimit, ProductSort, ProductTable, ResetFilter } from "./components";

export default function Products() {
  const [filterString, setFilterString] = useState<FilterString>({
    brand: "",
    category: "",
    archived: "",
  });

  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [productAPIURL, setProductAPIURL] = useState(`${API_URL}/products?limit=${limit}&`);
  const [combinedFilterString, setCombinedFilterString] = useState("");
  const [checkedArchived, setCheckedArchived] = useState<number[]>([]);
  const [checkedCategories, setCheckedCategories] = useState<number[]>([]);
  const [checkedBrands, setCheckedBrands] = useState<number[]>([]);
  const [filterAmount, setFilterAmount] = useState(0);
  const [data, setData] = useState<Data>({ products: [], categories: [], brands: [] });

  const getProducts = async (productAPIURL: string) => {
    const response = await fetch(productAPIURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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

  const handleResetFilters = () => {
    setCombinedFilterString("");
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
          categories: categoriesData,
          brands: brandsData,
          products: productsData,
        });
      } catch (error) {
        console.error("Error fetching categories, brands, and products:", error);
      }
    };

    fetchData();
  }, [productAPIURL]);

  useEffect(() => {
    const { brand, category, archived } = filterString;
    const combined = `${brand}${category}${archived}`;
    setCombinedFilterString(combined);
    setFilterAmount(checkedArchived.length + checkedBrands.length + checkedCategories.length);

    const updateUrl = () => {
      if (combinedFilterString) {
        const updatedUrl = `${API_URL}/products?limit=${limit}&${combinedFilterString}`;
        setProductAPIURL(updatedUrl);
      } else {
        setProductAPIURL(`${API_URL}/products?limit=${limit}&`);
      }
    };

    updateUrl();
  }, [checkedArchived.length, checkedBrands.length, checkedCategories.length, filterString, limit, combinedFilterString]);

  return (
    <div className="flex flex-col gap-20">
      <div className="md:px-0 px-4 flex justify-between flex-row border-b pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold w-full">Products ({data.products.length})</h1>
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
