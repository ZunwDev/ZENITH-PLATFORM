import { applyDiscount, removeLeadingZeroes, shortenText } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Thumbnail } from "../util";

interface ProductListingProps {
  productId?: string;
  previewData?: {
    imageThumbnail: string;
    description: string;
    price: number;
    discount: number;
    quantity: number;
    name: string;
  };
}

export default function ProductListing({
  productId = null,
  previewData = { imageThumbnail: "", description: "", price: 0, discount: 0, quantity: 0, name: "" },
}: ProductListingProps) {
  return (
    <>
      {previewData && (
        <Card title={previewData.name}>
          <CardContent className="relative">
            <div className="flex flex-col justify-center items-center h-[288px] md:size-[288px]">
              <Thumbnail url={previewData?.imageThumbnail} intristicSize={360} className="h-[288px] md:size-[288px] pt-4" />

              {/* Discount Badge (show only if discount is applied) */}
              {removeLeadingZeroes(previewData.discount) > 0 && (
                <div className="absolute top-0 right-0 mt-2 mr-2 px-2 py-1 bg-destructive text-white rounded-md text-xs font-bold">
                  {removeLeadingZeroes(previewData.discount)}% OFF
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col flex justify-start items-start gap-3">
            <Button variant="link" className="font-semibold text-base p-0 break-all text-left mb-1 whitespace-normal">
              {previewData?.name ? previewData?.name : "There will be a product name..."}
            </Button>
            <div className="text-sm mt-[-12px]">
              {previewData?.description
                ? shortenText(previewData?.description)
                : shortenText(
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                  )}
            </div>
            <div className="flex flex-row gap-2 items-center justify-between w-full mt-4">
              <div className="flex flex-row gap-2 items-center">
                <div className="font-bold text-2xl">
                  $
                  {removeLeadingZeroes(previewData?.discount) > 0
                    ? applyDiscount(previewData?.price, removeLeadingZeroes(previewData?.discount))
                    : previewData?.price
                    ? previewData?.price
                    : NaN}
                </div>

                {removeLeadingZeroes(previewData?.discount) > 0 && (
                  <span
                    className={removeLeadingZeroes(previewData?.discount) > 0 ? "font-normal text-muted-foreground" : ""}
                    style={{
                      backgroundImage:
                        removeLeadingZeroes(previewData?.discount) > 0
                          ? "linear-gradient(to top right, transparent calc(50% - 1px), gray 50%, transparent calc(50% + 1px))"
                          : "none",
                    }}>
                    ${previewData?.price ? previewData.price : NaN}
                  </span>
                )}
              </div>
              {previewData.quantity > 0 && (
                <span className="text-primary font-semibold text-center w-full">
                  {previewData.quantity > 4 ? "In stock > 5 pcs" : "In stock"}
                </span>
              )}
            </div>
            <Button variant="outline" className="flex gap-2 font-bold w-full">
              <ShoppingCart />
              Add to cart
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
