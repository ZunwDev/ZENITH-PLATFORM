import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Brand, Category } from "../products/interfaces";
import { fetchFilterData } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductImageManager from "../products/components/ProductImageManager";
import { CheckboxFormItem, InputFormItem, SelectFormItem, TextareaFormItem } from "@/components/util/FormItems";
import PageHeader from "@/components/global/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { json } from "@codemirror/lang-json";
import CodeMirror from "@uiw/react-codemirror";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { Button } from "@/components/ui/button";
import {
  API_URL,
  CATEGORY_TEMPLATE_MAPPING,
  IS_PARSE_ERROR_MESSAGE,
  NO_IMAGE_PROVIDED_MESSAGE,
  NO_SPECS_PROVIDED_MESSAGE,
  NO_THUMBNAIL_IMAGE_PROVIDED_MESSAGE,
} from "@/lib/constants";
import axios from "axios";
import { newAbortSignal } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useAdminCheck, useErrorToast, useSuccessToast } from "@/hooks";
import { uploadImagesToFirebase } from "@/lib/firebase";

const FormSchema = z.object({
  name: z.string().min(1).max(64),
  description: z.string().min(1).max(512),
  price: z.coerce.number().min(1),
  discount: z.coerce.number().min(0).max(90).optional(),
  quantity: z.coerce.number().min(1),
  category: z.string().min(1, {
    message: "You must specify the category of product.",
  }),
  brand: z.string().min(1, {
    message: "You must specify the brand of product.",
  }),
  archived: z.boolean(),
});

export default function NewProductForm() {
  useAdminCheck();
  const { resolvedTheme, forcedTheme } = useTheme();

  //Data
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  //Select stuff
  const [openCategory, setOpenCategory] = useState(false);
  const [openBrands, setOpenBrands] = useState(false);
  const [categoriesSelectedValue, setCategoriesSelectedValue] = useState("");
  const [brandsSelectedValue, setBrandsSelectedValue] = useState("");

  //Images
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageThumbnail, setImageThumbnail] = useState("");

  //Specs
  const [jsonData, setJsonData] = useState("");
  const [formattedJSON, setFormattedJSON] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  //Other
  const [isProductCreated, setIsProductCreated] = useState(false);
  const [productStage, setProductStage] = useState("Create");

  const showErrorToast = useErrorToast();
  const showSuccessToast = useSuccessToast();

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
      archived: false,
    },
  });

  const onChange = useCallback((val) => {
    setJsonData(val);
  }, []);

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
      const [categoryData, brandData] = await fetchFilterData();
      setCategories(categoryData);
      setBrands(brandData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setImageThumbnail(images[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  //if category changed, set corresponding jsonData template
  useEffect(() => {
    if (categoriesSelectedValue && categoriesSelectedValue in CATEGORY_TEMPLATE_MAPPING) {
      setJsonData(CATEGORY_TEMPLATE_MAPPING[categoriesSelectedValue]);
    } else {
      setJsonData("");
    }
  }, [categoriesSelectedValue]);

  const handleFormSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      await FormSchema.parseAsync(values);
      if (images.length === 0) return showErrorToast("Product Creation", NO_IMAGE_PROVIDED_MESSAGE);
      if (!jsonData) return showErrorToast("Product Creation", NO_SPECS_PROVIDED_MESSAGE);
      if (parseError) return showErrorToast("Product Creation", IS_PARSE_ERROR_MESSAGE);
      if (imageThumbnail == "") return showErrorToast("Product Creation", NO_THUMBNAIL_IMAGE_PROVIDED_MESSAGE);

      setIsProductCreated(true);
      setProductStage("Storing in database...");

      const response = await axios.post(`${API_URL}/products/create`, {
        signal: newAbortSignal(),
        product: {
          name: values.name,
          description: values.description,
          price: !values.price.toFixed(2).endsWith(".99") ? (values.price + 0.99).toFixed(2) : values.price.toFixed(2),
          specifications: formattedJSON.trim(),
          quantity: values.quantity,
          discount: values.discount,
          brand: brands.find((brand) => brand.name.toLowerCase() === values.brand.toLowerCase()),
          category: categories.find((category) => category.name.toLowerCase() === values.category.toLowerCase()),
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
      setProductStage("Create");
      setIsProductCreated(false);
      if (error.response && error.response.data.errorCode === 409) {
        form.setError("name", { message: "Product with this name already exists." });
      } else {
        console.error("Form validation failed:", error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-32 mt-32 px-8 md:min-w-[1600px] min-w-[360px] max-w-[1600px]">
      <div className="md:px-0 px-4 flex justify-between flex-row border-b pb-4">
        <PageHeader title="New Product" description="Add new product to the store" />
      </div>
      <div className="flex md:flex-row md:gap-8 gap-32 flex-col">
        <div className="flex flex-col md:w-80 w-full h-full">
          <ProductImageManager
            images={images}
            imageThumbnail={imageThumbnail}
            selectedImages={selectedImages}
            setImageThumbnail={setImageThumbnail}
            setImages={setImages}
            setSelectedImages={setSelectedImages}
          />
        </div>

        <div className="flex flex-col gap-8">
          <Card className="w-full border h-fit rounded-md">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Enter key product details for comprehensive information.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="flex md:flex-row md:gap-20 gap-4 flex-col">
                  <div className="flex flex-col md:w-1/3 w-full gap-4">
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
                      data={categories}
                      open={openCategory}
                      setOpen={setOpenCategory}
                      selectedValue={categoriesSelectedValue}
                      setSelectedValue={setCategoriesSelectedValue}></SelectFormItem>
                    <SelectFormItem
                      label="Brand"
                      id="brand"
                      placeholder="Search brands..."
                      description="Select corresponding brand to the product."
                      required
                      form={form}
                      data={brands}
                      open={openBrands}
                      setOpen={setOpenBrands}
                      selectedValue={brandsSelectedValue}
                      setSelectedValue={setBrandsSelectedValue}></SelectFormItem>
                    <CheckboxFormItem
                      id="archived"
                      label="Archived?"
                      description="Whether is product archived or not"
                      form={form}
                      data={undefined}></CheckboxFormItem>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product Specs</CardTitle>
              <CardDescription>
                Specify product specifications here. Ensure consistency across all products. These templates demonstrate the
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
              <CodeMirror
                value={formattedJSON}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                theme={forcedTheme ?? (resolvedTheme === "dark" ? githubDark : githubLight)}
                placeholder="Select any category, to get an editable template."
                height="252px"
                extensions={[json()]}
                onChange={onChange}
              />
            </CardContent>
          </Card>
          <Button type="button" onClick={form.handleSubmit(handleFormSubmit)} className="ml-auto" disabled={isProductCreated}>
            {productStage}
          </Button>
        </div>
      </div>
    </div>
  );
}
