import { useApiData } from "@/hooks";
import { getImagesFromFirebase } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import CategoryListItems from "./CategoryListItems";

export default function CategoryList() {
  const { data: categories, loading, error } = useApiData("products/type-counts", "", []);
  const [categoryImages, setCategoryImages] = useState({});

  useEffect(() => {
    const fetchImages = async () => {
      if (categories) {
        const images = await getImagesFromFirebase(`category_images`);
        setCategoryImages(images);
      }
    };

    fetchImages();
  }, [categories]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <section className="flex flex-row gap-4 pb-32 md:min-w-[1600px] min-w-[360px] xs:max-md:px-4">
      <div className="flex flex-col gap-2 pb-32 md:w-72 w-full">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex flex-col divide-y">
          <Accordion type="multiple">
            {categories?.map((category, index) => (
              <AccordionItem key={index} value={"item-" + index}>
                <AccordionTrigger className="">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="bg-accent-foreground/5 size-12 rounded-full flex justify-center items-center">
                      <img
                        src={categoryImages[index]}
                        alt={category.categoryId}
                        className="size-8 flex-shrink-0 object-contain"
                      />
                    </div>
                    <span className="font-semibold text-sm">{Object.keys(category)[0]}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CategoryListItems category={category} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
