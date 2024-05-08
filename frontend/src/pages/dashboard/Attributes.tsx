import { ToggleIDButton } from "@/components/dashboard/attributes/components";
import { Attribute, AttributeType } from "@/components/dashboard/attributes/interface";
import { DashboardPageLayout, PageHeader, SearchBar } from "@/components/dashboard/global";
import { FilterData } from "@/components/dashboard/products/interfaces";
import { ActionDialog } from "@/components/global";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdminCheck, useSearch } from "@/hooks";
import { fetchAttributeTypes, fetchAttributes, fetchFilterData } from "@/lib/api";
import { sortByIds } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function Attributes() {
  useAdminCheck();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const { handleSearch, getSearchQueryFromURL } = useSearch(setLocalSearchQuery);
  const [isShowID, setIsShowID] = useState(true);
  const [dbcSearch] = useDebounce(localSearchQuery, 250);

  const [data, setData] = useState<{
    attributeTypes: AttributeType[];
    filterData: FilterData;
    attributes: Attribute[];
  }>({
    attributeTypes: [],
    filterData: { categories: [], brands: [], productTypes: [] },
    attributes: [],
  });

  const fetchData = useCallback(async () => {
    try {
      const { categories, brands, productTypes } = await fetchFilterData();
      const [typeData, attributeData] = await Promise.all([fetchAttributeTypes(), fetchAttributes()]);

      setData((prevData) => ({
        ...prevData,
        attributeTypes: sortByIds(typeData, "attributeTypeId"),
        attributes: sortByIds(attributeData, "attributeId"),
        filterData: {
          categories: sortByIds(categories, "categoryId"),
          brands: sortByIds(brands, "brandId"),
          productTypes: sortByIds(productTypes, "productTypeId"),
        },
      }));
    } catch (error) {
      console.error("Fetching data failed:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardPageLayout>
      <main className="flex flex-1 flex-col gap-2 p-4 lg:gap-4 lg:p-6 pt-4">
        <div className="flex items-center justify-between px-4 md:px-0">
          <PageHeader title="Attribute Manager" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex md:flex-row flex-wrap md:justify-between items-center xs:px-4 sm:px-0 gap-1.5">
            <div className="flex flex-row gap-1.5">
              <SearchBar
                searchQuery={localSearchQuery || getSearchQueryFromURL}
                type="attributes"
                className="md:flex hidden"
                handleSearch={handleSearch}
              />
            </div>
            <div className="flex flex-row gap-1.5">
              <ToggleIDButton isShowID={isShowID} setIsShowID={setIsShowID} />{" "}
            </div>
          </div>
          <Card>
            <div className="flex items-center p-4 border-b">
              <h1 className="text-lg font-semibold">Attribute Types ({data.attributeTypes.length})</h1>
              <ActionDialog
                fetchData={fetchData}
                title="Attribute Type"
                endpoint="attribute_types"
                attributeId="attributeTypeId"
                actionType="add"
              />
            </div>
            <CardContent>
              {data.attributeTypes.map((item, index) => (
                <Accordion type="single" collapsible key={index}>
                  <AccordionItem value={`item-${index}`}>
                    <AccordionTrigger>
                      <span className="truncate">
                        {isShowID && <strong className="bg-muted p-2 rounded-full text-sm">#{item.attributeTypeId}</strong>}{" "}
                        {item.name}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col">
                      <div className="flex flex-wrap gap-3">
                        {data.attributes
                          .filter((attribute) => attribute.attributeTypeId === item.attributeTypeId)
                          .map((filteredAttribute, index) => (
                            <ActionDialog
                              fetchData={fetchData}
                              key={index}
                              isShowID={isShowID}
                              title={item.name}
                              item={filteredAttribute}
                              endpoint="attributes"
                              attributeId="attributeId"
                            />
                          ))}
                      </div>
                      <div className="flex flex-row ml-auto">
                        <ActionDialog
                          fetchData={fetchData}
                          key={index}
                          item={item}
                          title={item.name}
                          endpoint="attributes"
                          attributeId="attributeId"
                          actionType="add"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="lg:grid lg:grid-cols-2 xl:grid-cols-3 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Card>
              <ScrollArea className="lg:h-96" type="always">
                <div className="flex items-center p-4 border-b">
                  <h1 className="text-lg font-semibold">Categories ({data.filterData.categories.length})</h1>
                  <ActionDialog
                    fetchData={fetchData}
                    title="Category"
                    endpoint="categories"
                    attributeId="categoryId"
                    actionType="add"
                  />
                </div>
                <CardContent className="flex flex-wrap gap-3 py-4">
                  {data.filterData.categories.map((item, index) => (
                    <ActionDialog
                      fetchData={fetchData}
                      key={index}
                      title="Category"
                      item={item}
                      isShowID={isShowID}
                      endpoint="categories"
                      attributeId="categoryId"
                    />
                  ))}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
          <div className="flex flex-col gap-2">
            <Card>
              <ScrollArea className="lg:h-96" type="always">
                <div className="flex items-center p-4 border-b">
                  <h1 className="text-lg font-semibold">Product Types ({data.filterData.productTypes.length})</h1>
                  <ActionDialog
                    fetchData={fetchData}
                    title="Product Type"
                    endpoint="product_types"
                    attributeId="productTypeId"
                    actionType="add"
                  />
                </div>
                <CardContent className="flex flex-wrap gap-3 py-4">
                  {data.filterData.productTypes.map((item, index) => (
                    <ActionDialog
                      fetchData={fetchData}
                      key={index}
                      title="Product Type"
                      item={item}
                      isShowID={isShowID}
                      endpoint="product_types"
                      attributeId="productTypeId"
                    />
                  ))}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
          <div className="flex flex-col gap-2">
            <Card>
              <ScrollArea className="lg:h-96" type="always">
                <div className="flex items-center p-4 border-b">
                  <h1 className="text-lg font-semibold">Brands ({data.filterData.brands.length})</h1>
                  <ActionDialog fetchData={fetchData} title="Brand" endpoint="brands" attributeId="brandId" actionType="add" />
                </div>
                <CardContent className="flex flex-wrap gap-3 py-4">
                  {data.filterData.brands.map((item, index) => (
                    <ActionDialog
                      fetchData={fetchData}
                      key={index}
                      title="Brand"
                      item={item}
                      isShowID={isShowID}
                      endpoint="brands"
                      attributeId="brandId"
                    />
                  ))}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </main>
    </DashboardPageLayout>
  );
}
