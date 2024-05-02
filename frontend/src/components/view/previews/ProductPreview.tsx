import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Thumbnail } from "@/components/util";
import { LOREM_IPSUM } from "@/lib/constants";
import { applyDiscount, removeLeadingZeroes, shortenText } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useForm } from "react-hook-form";

interface ProductPreviewProps {
  imageThumbnail: string;
  form: ReturnType<typeof useForm>;
}

export default function ProductPreview({ imageThumbnail, form }: ProductPreviewProps) {
  const name = form.getValues("name") || "There will be a product name...";
  const description = form.getValues("description") ? shortenText(form.getValues("description")) : shortenText(LOREM_IPSUM);
  const price = parseInt(form.getValues("price")) + 0.99 || NaN;
  const discount = removeLeadingZeroes(form.getValues("discount"));
  const quantity = form.getValues("quantity");

  const discountedPrice = discount > 0 ? applyDiscount(price, discount) : price;
  const inStock = quantity > 10 ? "In stock" : quantity < 10 && quantity > 4 ? "In stock > 5 pcs" : `In stock: ${quantity} pcs`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Preview</CardTitle>
        <CardDescription>
          The preview may not fully act or display all details available on the real product listing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Card title={name}>
          <CardContent className="relative">
            <div className="flex flex-col justify-center items-center h-[288px] md:size-[288px]">
              <Thumbnail url={imageThumbnail} intristicSize={360} className="h-[288px] md:size-[288px] pt-4" />

              {/* Discount Badge (show only if discount is applied) */}
              {discount > 0 && (
                <div className="absolute top-0 right-0 mt-2 mr-2 px-2 py-1 bg-destructive text-white rounded-md text-xs font-bold">
                  {discount}% OFF
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col flex justify-start items-start gap-3">
            <Button variant="link" className="font-semibold text-base p-0 break-all text-left mb-1 whitespace-normal">
              {name}
            </Button>
            <div className="text-sm mt-[-12px]">{description}</div>
            <div className="flex flex-row gap-2 items-center justify-between w-full mt-4">
              <div className="flex flex-row gap-2 items-center">
                <div className="font-bold text-2xl">
                  ${discountedPrice}
                  {discount > 0 && (
                    <span
                      className="font-normal text-muted-foreground text-sm ml-2"
                      style={{
                        backgroundImage:
                          "linear-gradient(to top right, transparent calc(50% - 1px), gray 50%, transparent calc(50% + 1px))",
                      }}>
                      ${price}
                    </span>
                  )}
                </div>
              </div>
              {quantity > 0 && <span className="text-primary font-semibold text-center ml-auto">{inStock}</span>}
            </div>
            <Button variant="outline" className="flex gap-2 font-bold w-full">
              <ShoppingCart />
              Add to cart
            </Button>
          </CardFooter>
        </Card>
      </CardContent>
    </Card>
  );
}
