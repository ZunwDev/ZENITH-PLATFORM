import { EditProductForm, ProductSchema } from "@/components/dashboard/forms";
import { DashboardPageLayout, DiscardButton, PageHeader } from "@/components/dashboard/global";
import { CodeEditor, ProductImageManager } from "@/components/dashboard/products/components";
import { FilterData, Product } from "@/components/dashboard/products/interfaces";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BackArrow } from "@/components/util";
import { ProductPreview } from "@/components/view/previews";
import { useAdminCheck, useErrorToast, useFormStatus, useSuccessToast } from "@/hooks";
import { API_URL, fetchFilterData, fetchProductDataById, fetchStatusByName, newAbortSignal } from "@/lib/api";
import {
  IS_PARSE_ERROR_MESSAGE,
  NO_IMAGE_PROVIDED_MESSAGE,
  NO_SPECS_PROVIDED_MESSAGE,
  NO_THUMBNAIL_IMAGE_PROVIDED_MESSAGE,
} from "@/lib/constants";
import { getImagesFromFirebase, getThumbnailFromFirebase, updateProductImages } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import parse from "html-react-parser";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

export default function EditProduct() {
  useAdminCheck();
  const { stage, isSubmitting, updateStage, setSubmittingState } = useFormStatus("Save changes");
  const { productId } = useParams();
  const showErrorToast = useErrorToast();
  const showSuccessToast = useSuccessToast();

  //Data
  const [filterData, setFilterData] = useState<FilterData>({ categories: [], brands: [] });
  const [productData, setProductData] = useState<Product>();

  //Images
  const [images, setImages] = useState([]);
  const [imageThumbnail, setImageThumbnail] = useState("");

  //Specs
  const [jsonData, setJsonData] = useState("");
  const [formattedJSON, setFormattedJSON] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof ProductSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductSchema),
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        JSON.parse(jsonData);
        setFormattedJSON(JSON.stringify(JSON.parse(jsonData), null, 2));
        setParseError(null);
      } catch (error) {
        setParseError("Invalid JSON format: " + error.message);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [jsonData]);

  useEffect(() => {
    const fetchData = async () => {
      const { categories, brands } = await fetchFilterData();
      const productData = await fetchProductDataById(productId);
      const imagesFromFB = await getImagesFromFirebase("images", productId);
      setImages(imagesFromFB);
      setFilterData({ categories, brands });
      setProductData(productData);

      const { name, description, price, discount, quantity, status, category, brand, specifications } = productData;
      setJsonData(specifications);

      form.setValue("name", name);
      form.setValue("description", description);
      form.setValue("price", price);
      form.setValue("discount", discount);
      form.setValue("quantity", quantity);
      form.setValue("category", category.name);
      form.setValue("brand", brand.name);
      form.setValue("status", status.name);

      const thumbnailFromFB = await getThumbnailFromFirebase(productId);
      setImageThumbnail(thumbnailFromFB.url);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormSubmit = async (values: z.infer<typeof ProductSchema>) => {
    try {
      await ProductSchema.parseAsync(values);
      if (images.length === 0) return showErrorToast("Product Creation", NO_IMAGE_PROVIDED_MESSAGE);
      if (!jsonData) return showErrorToast("Product Creation", NO_SPECS_PROVIDED_MESSAGE);
      if (parseError) return showErrorToast("Product Creation", IS_PARSE_ERROR_MESSAGE);
      if (imageThumbnail == "") return showErrorToast("Product Creation", NO_THUMBNAIL_IMAGE_PROVIDED_MESSAGE);

      setSubmittingState(true);
      updateStage("Updating...");
      const statusId = await fetchStatusByName(encodeURIComponent(form.getValues("status")));

      const response = await axios.put(`${API_URL}/products/${productId}`, {
        signal: newAbortSignal(),
        product: {
          name: values.name,
          description: values.description,
          price: !values.price.toFixed(2).endsWith(".99") ? (values.price + 0.99).toFixed(2) : values.price.toFixed(2),
          specifications: formattedJSON,
          quantity: values.quantity,
          discount: values.discount,
          brand: filterData.brands.find((brand) => brand.name.toLowerCase() === values.brand.toLowerCase()),
          category: filterData.categories.find((category) => category.name.toLowerCase() === values.category.toLowerCase()),
          status: {
            status: { statusId },
          },
        },
      });

      updateStage("Uploading images...");
      await updateProductImages(response.data.product.productId, images, imageThumbnail);
      showSuccessToast("Product Update", `Product "${values.name}" successfully updated.`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      updateStage("Save changes");
      setSubmittingState(false);
      if (error?.response?.data?.errorCode === 409) {
        form.setError("name", { message: "Product with this name already exists." });
      } else {
        console.error("Form validation failed:", error);
      }
      showErrorToast(error.response.data.action, parse(error.response.data.message));
    }
  };

  useEffect(() => {}, [form.watch()]);

  return (
    <DashboardPageLayout>
      <div className="flex flex-col py-4 w-full min-w-[360px] border-b">
        <div className="md:px-0 flex justify-start gap-4 xs:items-start sm:items-center flex-row lg:mx-6 mx-4">
          <BackArrow link="../../products" />
          <PageHeader title="Edit Product" />
          <div className="ml-auto flex gap-2 md:flex-row flex-col">
            <DiscardButton typeOfDiscard="product" />
            <Button type="button" onClick={form.handleSubmit(handleFormSubmit)} disabled={isSubmitting}>
              {stage}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex md:flex-row md:gap-8 gap-32 flex-col lg:p-6 p-4">
        <div className="flex flex-col md:w-96 w-full h-full gap-8">
          <ProductImageManager
            images={images}
            imageThumbnail={imageThumbnail}
            setImageThumbnail={setImageThumbnail}
            setImages={setImages}
          />
          <ProductPreview imageThumbnail={imageThumbnail} form={form} />
        </div>

        <div className="flex flex-col gap-8 w-full">
          <EditProductForm productData={productData} form={form} filterData={filterData} />
          <Card>
            <CardHeader>
              <CardTitle>Product Specs</CardTitle>
              <CardDescription>
                Update product specifications here. Ensure consistency across all products. These templates demonstrate the
                content each category can include.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {jsonData !== "" && parseError && (
                <Alert variant="destructive">
                  <AlertCircle className="size-5" />
                  <AlertDescription>{parseError}</AlertDescription>
                </Alert>
              )}
              <CodeEditor formattedJSON={formattedJSON} setJsonData={setJsonData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  );
}
