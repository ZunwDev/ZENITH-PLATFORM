import BannerGrid from "@/components/dashboard/banners/components/BannerGrid";
import { Page } from "@/components/dashboard/banners/interfaces";
import { FullSidebar, SheetSidebar } from "@/components/dashboard/components";
import { NewButton, PageHeader } from "@/components/global";
import { User } from "@/components/header";
import { useAdminCheck } from "@/hooks";
import { API_URL, fetchFilterData } from "@/lib/api";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { AmountData, Category, Checked, Status, initialCheckedState } from "@/lib/interfaces";
import { buildQueryParams, newAbortSignal } from "@/lib/utils";
import axios from "axios";
import { BookPlus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDebounce } from "use-debounce";

export default function Banners() {
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useAdminCheck();

  // Filter related
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [filterAmount, setFilterAmount] = useState(0);
  const [checked, setChecked] = useState<Checked>(initialCheckedState);
  const [pageData, setPageData] = useState<Page>({} as Page);
  const [amountData, setAmountData] = useState<AmountData>({} as AmountData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterData, setFilterData] = useState({
    category: [] as Category[],
    status: [] as Status[],
  });

  // Debounced values
  const [dbcSearch] = useDebounce(searchQuery, 250);

  const APIURL = useMemo(() => {
    const pageQueryParam = parseInt(queryParams.get("p")) || 1;
    const paramsObj = {
      limit,
      page: pageQueryParam - 1,
      searchQuery: dbcSearch || "",
      category: checked.category,
      status: checked.status,
    };

    const queryString = buildQueryParams(paramsObj);
    return queryString;
  }, [checked, limit, dbcSearch, queryParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch filter data
        const [categoryData, , , , statusData] = await fetchFilterData();
        setFilterData({ category: categoryData, status: statusData });
      } catch (error) {
        console.error("Error fetching filter data:", error.response?.data?.message || error.message);
      }
    };

    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${API_URL}/banners?${APIURL}`, {
          signal: newAbortSignal(),
        });
        //const amountsResponse = await axios.get(`${API_URL}/banners/amounts?${APIURL}`);

        setPageData(response.data);
        //setAmountData(amountsResponse.data);
      } catch (error) {
        console.error("Error fetching banners:", error.response?.data?.message || error.message);
        setPageData({} as Page);
        //setAmountData({} as AmountData);
      }
    };

    fetchData();
    fetchBanners();

    return () => {
      // Clean up any resources if necessary
    };
  }, [limit, APIURL]);

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
    <>
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
              <PageHeader title="Banner Manager" />
            </div>
            <div className="flex md:flex-row flex-wrap md:justify-between items-center xs:px-4 sm:px-0 gap-1.5">
              {pageData.totalElements > 0 && <NewButton path="banners" icon={<BookPlus />} type="Banner" className="ml-auto" />}
            </div>
            <div
              className={`flex flex-1 ${
                !pageData || Object.keys(pageData).length === 0 ? "items-center justify-center" : "items-start w-full"
              } p-4 rounded-lg border border-dashed shadow-sm`}>
              <div className="flex flex-col items-center gap-2 text-center w-full">
                {!pageData || Object.keys(pageData).length === 0 ? (
                  <>
                    <h3 className="text-2xl font-bold tracking-tight">You have no banners</h3>
                    <p className="text-sm text-muted-foreground">
                      You can start advertising stuff as soon as you add an active banner.
                    </p>
                    <NewButton path="banners" icon={<BookPlus />} type="Banner" className="mt-4" />
                  </>
                ) : (
                  <BannerGrid data={pageData} />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
