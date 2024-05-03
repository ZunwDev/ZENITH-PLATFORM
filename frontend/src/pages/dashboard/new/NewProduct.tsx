import { NewProductForm, ProductSchema, SpecsGeneratorForm } from "@/components/dashboard/forms";
import { DashboardPageLayout, PageHeader } from "@/components/dashboard/global";
import { CodeEditor, ProductImageManager } from "@/components/dashboard/products/components";
import { FilterData } from "@/components/dashboard/products/interfaces";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertInCardDescription, BackArrow, InformationDescription } from "@/components/util";
import { ProductPreview, SpecsPreview } from "@/components/view/previews";
import { useAdminCheck, useErrorToast, useFormStatus, useSuccessToast } from "@/hooks";
import {
  API_URL,
  fetchBrandIdByName,
  fetchCategoryIdByName,
  fetchFilterData,
  fetchProductTypeDataByCategoryId,
  fetchStatusIdByName,
  newAbortSignal,
} from "@/lib/api";
import {
  IS_PARSE_ERROR_MESSAGE,
  NO_IMAGE_PROVIDED_MESSAGE,
  NO_SPECS_PROVIDED_MESSAGE,
  NO_THUMBNAIL_IMAGE_PROVIDED_MESSAGE,
} from "@/lib/constants";
import { FormFields } from "@/lib/enum/schemas";
import { uploadImagesToFirebase } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import parse from "html-react-parser";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function NewProduct() {
  useAdminCheck();
  const showErrorToast = useErrorToast();
  const showSuccessToast = useSuccessToast();
  const { stage, isSubmitting, updateStage, setSubmittingState, resetFormStatus } = useFormStatus("Create product");

  // Data
  const [filterData, setFilterData] = useState<FilterData>({ categories: [], brands: [], productTypes: [] });
  const [images, setImages] = useState([]);
  const [imageThumbnail, setImageThumbnail] = useState("");
  const [jsonData, setJsonData] = useState("");
  const [formattedJSON, setFormattedJSON] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<number>();
  const [brandId, setBrandId] = useState<number>();
  const [statusId, setStatusId] = useState<number>();
  const [addFormSchemaData, setAddFormSchemaData] = useState([]);

  const form = useForm<z.infer<typeof ProductSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: null,
      discount: 0,
      quantity: null,
      category: "",
      brand: "",
      type: "",
      status: "active",
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
      try {
        const { categories, brands } = await fetchFilterData();
        let productTypesData = categoryId ? await fetchProductTypeDataByCategoryId(categoryId) : [];
        setFilterData((prev) => ({ ...prev, categories, brands, productTypes: productTypesData }));
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error, perhaps set a default state or display an error message
      }
    };

    fetchData();
  }, [categoryId]);

  useEffect(() => {
    setImageThumbnail(images[0]);
  }, [images]);

  useEffect(() => {
    setAddFormSchemaData(FormFields[form.getValues("type")] || []);
  }, [form.getValues("type")]);

  const handleFormSubmit = async (values: z.infer<typeof ProductSchema>) => {
    try {
      await ProductSchema.parseAsync(values);
      const action = "Product Creation";
      if (images.length === 0) return showErrorToast(action, NO_IMAGE_PROVIDED_MESSAGE);
      if (!jsonData) return showErrorToast(action, NO_SPECS_PROVIDED_MESSAGE);
      if (parseError) return showErrorToast(action, IS_PARSE_ERROR_MESSAGE);
      if (imageThumbnail == "") return showErrorToast(action, NO_THUMBNAIL_IMAGE_PROVIDED_MESSAGE);

      setSubmittingState(true);
      updateStage("Storing in database...");

      const response = await axios.post(`${API_URL}/products/create`, {
        signal: newAbortSignal(),
        product: {
          name: values.name,
          description: values.description,
          price: !values.price.toFixed(2).endsWith(".99") ? (values.price + 0.99).toFixed(2) : values.price.toFixed(2),
          specifications: formattedJSON,
          quantity: values.quantity,
          discount: values.discount,
          brand: brandId,
          category: categoryId,
          status: { statusId },
        },
      });

      updateStage("Uploading images...");
      await uploadImagesToFirebase(response.data.product.productId, images, imageThumbnail);
      showSuccessToast("Product Creation", `Product "${values.name}" successfully created.`);
      setTimeout(() => {
        form.reset();
        resetFormStatus();
        setImageThumbnail("");
        setImages([]);
      }, 1000);
    } catch (error) {
      updateStage("Create product");
      setSubmittingState(false);
      if (error?.response?.data?.errorCode === 409) {
        form.setError("name", { message: "Product with this name already exists." });
      } else {
        console.error("Form validation failed:", error);
      }
      showErrorToast(error.response.data.action, parse(error.response.data.message));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const categoryId =
        form.getValues("category") && (await fetchCategoryIdByName(encodeURIComponent(form.getValues("category"))));
      const brandId = form.getValues("brand") && (await fetchBrandIdByName(encodeURIComponent(form.getValues("brand"))));
      const statusId = form.getValues("status") && (await fetchStatusIdByName(encodeURIComponent(form.getValues("status"))));
      setCategoryId(categoryId);
      setBrandId(brandId);
      setStatusId(statusId);
    };
    fetchData();
  }, [form.getValues("category"), form.getValues("brand"), form.getValues("status")]);

  useEffect(() => {}, [form.watch()]);

  return (
    <DashboardPageLayout>
      <div className="flex flex-col py-4 w-full min-w-[360px] border-b">
        <div className="md:px-0 flex justify-start gap-4 xs:items-start sm:items-center flex-row lg:mx-6 mx-4">
          <BackArrow link="../products" />
          <PageHeader title="New Product" />
          <div className="ml-auto space-x-2">
            <Button type="button" onClick={form.handleSubmit(handleFormSubmit)} className="w-full" disabled={isSubmitting}>
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
          <SpecsPreview
            typesSelectedValue={form.getValues("type")}
            jsonData={jsonData}
            parseError={parseError}
            formattedJSON={formattedJSON}
            setJsonData={setJsonData}
          />
          <ProductPreview imageThumbnail={imageThumbnail} form={form} />
        </div>
        <div className="flex flex-col gap-8 w-full">
          <NewProductForm form={form} categoryId={categoryId} filterData={filterData} />
          <Card>
            <CardHeader>
              <CardTitle>Additional Product Information</CardTitle>
              <CardDescription>
                This section is primarily used for generating specs that can be seen below this form. Please ensure consistency
                across all products.
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
                typesSelectedValue={filterData.productTypes?.find(
                  (item) => item.toLowerCase() === form.getValues("type").toLowerCase()
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product Specs</CardTitle>
              <CardDescription>
                Specify product specifications here. Ensure consistency across all products in the category.
                <InformationDescription>You can directly edit here or use the form to make work easier.</InformationDescription>
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
