import { Attribute, AttributeType } from "@/components/dashboard/attributes/interface";
import { FullSidebar, SheetSidebar } from "@/components/dashboard/components";
import { FilterData } from "@/components/dashboard/products/interfaces";
import { ActionDialog, PageHeader } from "@/components/global";
import { User } from "@/components/header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminCheck } from "@/hooks";
import { fetchAttributeTypes, fetchAttributes, fetchFilterData } from "@/lib/api";
import { sortByIds } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

export default function Attributes() {
  useAdminCheck();

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
      const [categoryData, brandData] = await fetchFilterData();
      const [typeData, attributeData] = await Promise.all([fetchAttributeTypes(), fetchAttributes()]);

      setData((prevData) => ({
        ...prevData,
        attributeTypes: sortByIds(typeData, "attributeTypeId"),
        attributes: sortByIds(attributeData, "attributeId"),
        filterData: {
          categories: sortByIds(categoryData, "categoryId"),
          brands: sortByIds(brandData, "brandId"),
          productTypes: [],
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
              <PageHeader title="Attribute Manager" />
            </div>
            <div className="flex flex-col gap-2">
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
                            <strong className="bg-muted p-2 rounded-full text-sm">#{item.attributeTypeId}</strong> {item.name}
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
            <div className="flex flex-col gap-2">
              <Card>
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
                      endpoint="categories"
                      attributeId="categoryId"
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-col gap-2">
              <Card>
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
                      endpoint="brands"
                      attributeId="brandId"
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
