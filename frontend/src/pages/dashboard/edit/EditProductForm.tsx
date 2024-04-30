import { User } from "@/components/header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { BackArrow, InputFormItem, SelectFormItem, TextareaFormItem } from "@/components/util";
import ProductPreview from "@/components/view/previews/ProductPreview";
import { useAdminCheck, useErrorToast, useFormStatus, useSuccessToast } from "@/hooks";
import { API_URL, fetchFilterData, fetchProductDataById } from "@/lib/api";
import {
  IS_PARSE_ERROR_MESSAGE,
  NO_IMAGE_PROVIDED_MESSAGE,
  NO_SPECS_PROVIDED_MESSAGE,
  NO_THUMBNAIL_IMAGE_PROVIDED_MESSAGE,
} from "@/lib/constants";
import { getImagesFromFirebase, getThumbnailFromFirebase, updateProductImages } from "@/lib/firebase";
import { getStatusId, newAbortSignal } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import parse from "html-react-parser";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { ProductSchema } from "../../../components/dashboard/forms";
import { FullSidebar, PageHeader, SheetSidebar } from "../../../components/dashboard/global";
import { CodeEditor, ProductImageManager } from "../../../components/dashboard/products/components";
import { FilterData, Product } from "../../../components/dashboard/products/interfaces";

export default function EditProductForm() {
  useAdminCheck();
  const { stage, isSubmitting, updateStage, setSubmittingState } = useFormStatus("Save changes");
  const { productId } = useParams();
  const showErrorToast = useErrorToast();
  const showSuccessToast = useSuccessToast();

  //Data
  const [filterData, setFilterData] = useState<FilterData>({ categories: [], brands: [] });
  const [productData, setProductData] = useState<Product>();

  //Select stuff
  const [categoriesSelectedValue, setCategoriesSelectedValue] = useState("");
  const [brandsSelectedValue, setBrandsSelectedValue] = useState("");
  const [statusSelectedValue, setStatusSelectedValue] = useState("");

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
      const [categoryData, brandData, , ,] = await fetchFilterData();
      const productData = await fetchProductDataById(productId);
      const imagesFromFB = await getImagesFromFirebase("images", productId);
      setImages(imagesFromFB);
      setFilterData({ categories: categoryData, brands: brandData });
      setProductData(productData.data);

      const { name, description, price, discount, quantity, status, category, brand, specifications } = productData.data;
      setCategoriesSelectedValue(category.name);
      setBrandsSelectedValue(brand.name);
      setStatusSelectedValue(status.name);
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

  const handleDiscardEdit = () => {
    showSuccessToast("Discard Successful", "The changes to the product have been successfully discarded.");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleFormSubmit = async (values: z.infer<typeof ProductSchema>) => {
    try {
      await ProductSchema.parseAsync(values);
      if (images.length === 0) return showErrorToast("Product Creation", NO_IMAGE_PROVIDED_MESSAGE);
      if (!jsonData) return showErrorToast("Product Creation", NO_SPECS_PROVIDED_MESSAGE);
      if (parseError) return showErrorToast("Product Creation", IS_PARSE_ERROR_MESSAGE);
      if (imageThumbnail == "") return showErrorToast("Product Creation", NO_THUMBNAIL_IMAGE_PROVIDED_MESSAGE);

      setSubmittingState(true);
      updateStage("Updating...");

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
            status: { statusId: getStatusId(values) },
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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <FullSidebar />
      <div className="flex flex-col">
        <div className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <SheetSidebar />
          <div className="ml-auto">
            <User />
          </div>
        </div>
        <div className="flex flex-col py-4 w-full min-w-[360px] border-b">
          <div className="md:px-0 flex justify-start gap-4 xs:items-start sm:items-center flex-row lg:mx-6 mx-4">
            <BackArrow link="../../products" />
            <PageHeader title="Edit Product" />
            <div className="ml-auto flex gap-2 md:flex-row flex-col">
              <Button variant="outline" onClick={handleDiscardEdit}>
                Discard
              </Button>
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
            <Card>
              <CardHeader>
                <CardTitle>Product Preview</CardTitle>
                <CardDescription>
                  The preview may not fully act or display all details available on the real product listing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductPreview imageThumbnail={imageThumbnail} form={form} />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-8 w-full">
            <Card className="w-full border h-fit rounded-md">
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Update key product details for comprehensive information.</CardDescription>
              </CardHeader>
              <CardContent>
                {productData && (
                  <Form {...form}>
                    <form className="flex xl:flex-row xl:gap-20 gap-4 flex-col">
                      <div className="flex flex-col xl:w-1/4 w-full gap-4">
                        <InputFormItem
                          label="Product Name"
                          id="name"
                          placeholder="HP EliteBook 650 G10"
                          form={form}
                          required
                          description="Enter the name of the product."></InputFormItem>
                        <TextareaFormItem
                          label="Product Description"
                          id="description"
                          form={form}
                          required
                          description="Briefly describe the product and its main features."
                          placeholder='Notebook - Intel Core i5 1345U Raptor Lake, 15.6" IPS anti-glare 1920×1080, RAM 16GB DDR4, Intel Iris Xe Graphics, SSD 512GB, numeric keypad, backlit keypad, webcam, USB 3.2 Gen 1, USB-C, fingerprint reader, WiFi 6E, WiFi, Weight 1.78 kg, Windows 11 Pro'></TextareaFormItem>
                      </div>
                      <div className="flex flex-col md:w-1/4 w-full gap-4">
                        <InputFormItem
                          label="Price"
                          id="price"
                          type="number"
                          placeholder="49.99"
                          required
                          description="Specify the price of the product. Always end the price with 9 (e.g., 49.99)."
                          form={form}
                          prefix="$"></InputFormItem>
                        <InputFormItem
                          label="Discount"
                          id="discount"
                          type="number"
                          placeholder="20"
                          description="Set the discount percentage for the product (e.g., 20 for 20% off)."
                          form={form}
                          suffix="%"></InputFormItem>
                        <InputFormItem
                          label="Quantity"
                          id="quantity"
                          type="number"
                          placeholder="100"
                          required
                          description="Enter the quantity of the product in stock."
                          form={form}></InputFormItem>
                      </div>
                      <div className="flex flex-col md:w-1/4 w-full gap-4">
                        <SelectFormItem
                          label="Category"
                          id="category"
                          placeholder="Search categories..."
                          description="Select corresponding category to the product."
                          required
                          form={form}
                          data={filterData.categories}
                          selectedValue={categoriesSelectedValue}
                          setSelectedValue={setCategoriesSelectedValue}></SelectFormItem>
                        <SelectFormItem
                          label="Brand"
                          id="brand"
                          placeholder="Search brands..."
                          description="Select corresponding brand to the product."
                          required
                          form={form}
                          data={filterData.brands}
                          selectedValue={brandsSelectedValue}
                          setSelectedValue={setBrandsSelectedValue}></SelectFormItem>
                        <SelectFormItem
                          label="Status"
                          id="status"
                          placeholder="Search statuses..."
                          description="Select corresponding status to the product."
                          required
                          form={form}
                          data={["Active", "Draft", "Archived"]}
                          selectedValue={statusSelectedValue}
                          setSelectedValue={setStatusSelectedValue}
                        />
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
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
      </div>
    </div>
  );
}
