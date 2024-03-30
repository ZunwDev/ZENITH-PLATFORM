import { PageHeader } from "@/components/global";
import { User } from "@/components/header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  AlertInCardDescription,
  CheckboxFormItem,
  InformationDescription,
  InputFormItem,
  SelectFormItem,
  TextareaFormItem,
} from "@/components/util";
import ProductListing from "@/components/view/ProductListing";
import { useAdminCheck, useErrorToast, useSuccessToast } from "@/hooks";
import { API_URL, fetchAttributeDataWithCategoryId, fetchFilterData } from "@/lib/api";
import {
  IS_PARSE_ERROR_MESSAGE,
  NO_IMAGE_PROVIDED_MESSAGE,
  NO_SPECS_PROVIDED_MESSAGE,
  NO_THUMBNAIL_IMAGE_PROVIDED_MESSAGE,
} from "@/lib/constants";
import { FormFields } from "@/lib/enum/schemas";
import { uploadImagesToFirebase } from "@/lib/firebase";
import { cn, includesAny, newAbortSignal } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormSchema, SpecsGeneratorForm } from ".";
import { FullSidebar, SheetSidebar } from "../components";
import { CodeEditor, ProductImageManager } from "../products/components";
import { FilterData } from "../products/interfaces";

export default function NewProductForm() {
  useAdminCheck();
  const showErrorToast = useErrorToast();
  const showSuccessToast = useSuccessToast();

  // Data
  const [filterData, setFilterData] = useState<FilterData>({ categories: [], brands: [], productTypes: [] });
  const [images, setImages] = useState([]);
  const [imageThumbnail, setImageThumbnail] = useState("");
  const [jsonData, setJsonData] = useState("");
  const [formattedJSON, setFormattedJSON] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProductCreated, setIsProductCreated] = useState(false);
  const [productStage, setProductStage] = useState("Create product");
  const [categoryId, setCategoryId] = useState<number>();
  const [brandId, setBrandId] = useState<number>();
  const [categoriesSelectedValue, setCategoriesSelectedValue] = useState("");
  const [brandsSelectedValue, setBrandsSelectedValue] = useState("");
  const [typesSelectedValue, setTypesSelectedValue] = useState("");
  const [addFormSchemaData, setAddFormSchemaData] = useState([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: null,
      discount: 0,
      quantity: null,
      category: "",
      brand: "",
      type: "",
      archived: false,
    },
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
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [jsonData]);

  useEffect(() => {
    const fetchData = async () => {
      const [categoryData, brandData] = await fetchFilterData();
      const productTypesData = categoryId ? await fetchAttributeDataWithCategoryId(categoryId, 1) : []; //1 are product types id

      setFilterData({ categories: categoryData, brands: brandData, productTypes: productTypesData });
    };
    fetchData();
  }, [categoryId]);

  useEffect(() => {
    setImageThumbnail(images[0]);
  }, [images]);

  useEffect(() => {
    setAddFormSchemaData(FormFields[typesSelectedValue] || []);
  }, [typesSelectedValue]);

  const handleFormSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await FormSchema.parseAsync(values);
      const action = "Product Creation";
      if (images.length === 0) return showErrorToast(action, NO_IMAGE_PROVIDED_MESSAGE);
      if (!jsonData) return showErrorToast(action, NO_SPECS_PROVIDED_MESSAGE);
      if (parseError) return showErrorToast(action, IS_PARSE_ERROR_MESSAGE);
      if (imageThumbnail == "") return showErrorToast(action, NO_THUMBNAIL_IMAGE_PROVIDED_MESSAGE);

      setIsProductCreated(true);
      setProductStage("Storing in database...");

      const response = await axios.post(`${API_URL}/products/create`, {
        signal: newAbortSignal(),
        product: {
          name: values.name,
          description: values.description,
          price: !values.price.toFixed(2).endsWith(".99") ? (values.price + 0.99).toFixed(2) : values.price.toFixed(2),
          specifications: formattedJSON,
          quantity: values.quantity,
          discount: values.discount,
          brand: filterData.brands.find((brand) => brand.brandId === brandId),
          category: filterData.categories.find((category) => category.categoryId === categoryId),
          archived: {
            archivedId: values.archived ? 1 : 2,
          },
        },
      });

      setProductStage("Uploading images...");
      await uploadImagesToFirebase(response.data.product.productId, images, imageThumbnail);
      showSuccessToast("Product Creation", `Product "${values.name}" successfully created.`);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setProductStage("Create product");
      setIsProductCreated(false);
      if (error.response && error.response.data.errorCode === 409) {
        form.setError("name", { message: "Product with this name already exists." });
      } else {
        console.error("Form validation failed:", error);
      }
    }
  };

  function findId(array: any[], selectedValue: string, id: string): number | null {
    const foundData = array.find((item) => item.name.toLowerCase() === selectedValue.toLowerCase());
    return foundData ? foundData[id] : null;
  }

  useEffect(() => {
    const categoryId = findId(filterData.categories, categoriesSelectedValue, "categoryId");
    const brandId = findId(filterData.brands, brandsSelectedValue, "brandId");

    setCategoryId(categoryId);
    setBrandId(brandId);
  }, [brandsSelectedValue, categoriesSelectedValue, filterData]);

  useEffect(() => {}, [form.watch()]);

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
          <div className="flex flex-col gap-12 pb-32 p-8 w-full min-w-[360px]">
            <div className="md:px-0 flex justify-start gap-4 xs:items-start sm:items-center flex-row border-b pb-4">
              <Button variant="outline" className="w-fit mb-4 md:mb-0" asChild>
                <a href="../products">
                  <ArrowLeft className="size-5" />
                </a>
              </Button>
              <PageHeader title="New Product" description="Add new product to the store" />
              <div className="ml-auto space-x-2">
                <Button
                  type="button"
                  onClick={form.handleSubmit(handleFormSubmit)}
                  className="w-full"
                  disabled={isProductCreated}>
                  {productStage}
                </Button>
              </div>
            </div>
            <div className="flex md:flex-row md:gap-8 gap-32 flex-col">
              <div className="flex flex-col md:w-96 w-full h-full gap-8">
                <ProductImageManager
                  images={images}
                  imageThumbnail={imageThumbnail}
                  setImageThumbnail={setImageThumbnail}
                  setImages={setImages}
                />
                <Card className={cn("hidden", { block: categoriesSelectedValue || typesSelectedValue })}>
                  <CardHeader>
                    <CardTitle>Product Specs</CardTitle>
                    <CardDescription>These specs are only read-only for easier lookup. The editor is below.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {jsonData !== "" && parseError && (
                      <Alert variant="destructive">
                        <AlertCircle className="size-5" />
                        <AlertDescription>{parseError}</AlertDescription>
                      </Alert>
                    )}
                    <CodeEditor formattedJSON={formattedJSON} setJsonData={setJsonData} isReadOnly={true} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Product Preview</CardTitle>
                    <CardDescription>
                      The preview may not fully act or display all details available on the real product listing.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProductListing
                      previewData={{
                        imageThumbnail: imageThumbnail,
                        description: form.getValues("description"),
                        price: form.getValues("price"),
                        discount: form.getValues("discount"),
                        quantity: form.getValues("quantity"),
                        name: form.getValues("name"),
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-8 w-full">
                <Card className="w-full border h-fit rounded-md">
                  <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                    <CardDescription>Enter key product details for comprehensive information.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form className="flex md:flex-row md:gap-20 gap-4 flex-wrap">
                        <div className="flex flex-col xl:w-1/4 w-full gap-4">
                          <InputFormItem
                            label="Product Name"
                            id="name"
                            placeholder="HP EliteBook 650 G10"
                            form={form}
                            required
                            description="Enter the name of the product."
                          />
                          <TextareaFormItem
                            label="Product Description"
                            id="description"
                            form={form}
                            required
                            description="Briefly describe the product and its main features."
                            placeholder='Notebook - Intel Core i5 1345U Raptor Lake, 15.6" IPS anti-glare 1920×1080, RAM 16GB DDR4, Intel Iris Xe Graphics, SSD 512GB, numeric keypad, backlit keypad, webcam, USB 3.2 Gen 1, USB-C, fingerprint reader, WiFi 6E, WiFi, Weight 1.78 kg, Windows 11 Pro'
                          />
                        </div>
                        <div className="flex flex-col xl:w-1/4 w-full gap-4">
                          <InputFormItem
                            label="Price"
                            id="price"
                            type="number"
                            placeholder="49.99"
                            required
                            description="Specify the price of the product. Always end the price with 9 (e.g., 49.99)."
                            form={form}
                            prefix="$"
                          />
                          <InputFormItem
                            label="Discount"
                            id="discount"
                            type="number"
                            placeholder="20"
                            description="Set the discount percentage for the product (e.g., 20 for 20% off)."
                            form={form}
                            suffix="%"
                          />
                          <InputFormItem
                            label="Quantity"
                            id="quantity"
                            type="number"
                            placeholder="100"
                            required
                            description="Enter the quantity of the product in stock."
                            form={form}
                          />
                        </div>
                        <div className="flex flex-col xl:w-1/4 w-full gap-4">
                          <SelectFormItem
                            label="Category"
                            id="category"
                            placeholder="Search categories..."
                            description="Select corresponding category to the product."
                            required
                            form={form}
                            data={filterData.categories}
                            selectedValue={categoriesSelectedValue}
                            setSelectedValue={setCategoriesSelectedValue}
                          />
                          {includesAny(categoryId, [1, 6]) && (
                            <SelectFormItem
                              label="Product Type"
                              id="type"
                              placeholder="Search types..."
                              description="Select corresponding type to the product."
                              required
                              form={form}
                              data={filterData.productTypes}
                              selectedValue={typesSelectedValue}
                              setSelectedValue={setTypesSelectedValue}
                            />
                          )}
                          <SelectFormItem
                            label="Brand"
                            id="brand"
                            placeholder="Search brands..."
                            description="Select corresponding brand to the product."
                            required
                            form={form}
                            data={filterData.brands}
                            selectedValue={brandsSelectedValue}
                            setSelectedValue={setBrandsSelectedValue}
                          />
                          <CheckboxFormItem
                            id="archived"
                            label="Archived?"
                            description="Whether is product archived or not"
                            form={form}
                            data={undefined}
                          />
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Additional Product Information</CardTitle>
                    <CardDescription>
                      This section is primarily used for generating specs that can be seen below this form. Please ensure
                      consistency across all products.
                      <InformationDescription>
                        Note that changes made directly in the code editor <strong>will not</strong> be reflected in the form.
                      </InformationDescription>
                      <AlertInCardDescription>
                        <strong>Key Information</strong> is automatically generated based on the product schema defined for any
                        product type.
                      </AlertInCardDescription>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SpecsGeneratorForm
                      addFormSchemaData={addFormSchemaData}
                      setJsonData={setJsonData}
                      typesSelectedValue={filterData.productTypes.find(
                        (item) => item.toLowerCase() === typesSelectedValue.toLowerCase()
                      )}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Product Specs</CardTitle>
                    <CardDescription>
                      Specify product specifications here. Ensure consistency across all products in the category.
                      <InformationDescription>
                        You can directly edit here or use the form to make work easier.
                      </InformationDescription>
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
      </div>
    </>
  );
}
