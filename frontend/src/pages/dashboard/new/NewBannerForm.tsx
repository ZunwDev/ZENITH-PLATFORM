import { User } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  BackArrow,
  CheckboxFormItem,
  DateRangeFormItem,
  InputFormItem,
  NoValidationInputFile,
  SelectFormItem,
} from "@/components/util";
import BannerPreview from "@/components/view/previews/BannerPreview";
import { useAdminCheck, useErrorToast, useFormStatus, useSuccessToast } from "@/hooks";
import { API_URL, fetchFilterData } from "@/lib/api";
import { NO_IMAGE_PROVIDED_MESSAGE } from "@/lib/constants";
import { uploadImageToFirebase } from "@/lib/firebase";
import { findId, getStatusId, newAbortSignal } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { addDays } from "date-fns";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BannerSchema } from "../../../components/dashboard/forms/schema";
import { FullSidebar, PageHeader, SheetSidebar } from "../../../components/dashboard/global";
import { FilterData } from "../../../components/dashboard/products/interfaces";

export default function NewBannerForm() {
  useAdminCheck();
  const showErrorToast = useErrorToast();
  const showSuccessToast = useSuccessToast();
  const { stage, isSubmitting, updateStage, setSubmittingState, resetFormStatus } = useFormStatus("Create banner");

  const [filterData, setFilterData] = useState<FilterData>({ categories: [] });
  const [image, setImage] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("homepage");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("draft");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("horizontal");

  const setSelectedPositionAndUpdateCategory = (position: string) => {
    if (position === "homepage") {
      // If the selected position is "Homepage", reset the selected category to ""
      setSelectedCategory("");
    }
    // Update the selected position
    setSelectedPosition(position);
  };

  const currentDate = new Date();
  const initialDateRange: DateRange = {
    from: currentDate,
    to: addDays(currentDate, 7),
  };

  const [date, setDate] = useState<DateRange | undefined>(initialDateRange);
  const [categoryId, setCategoryId] = useState<number>();

  const form = useForm<z.infer<typeof BannerSchema>>({
    mode: "onChange",
    resolver: zodResolver(BannerSchema),
    defaultValues: {
      name: "",
      aspect_ratio: "horizontal",
      position: "homepage",
      category: "",
      status: "draft",
      date_range: initialDateRange,
      link: "",
      include_button: false,
    },
  });

  const handleFormSubmit = async (values: z.infer<typeof BannerSchema>) => {
    try {
      await BannerSchema.parseAsync(values);
      if (image === "") return showErrorToast("Banner Creation", NO_IMAGE_PROVIDED_MESSAGE);

      setSubmittingState(true);
      updateStage("Storing in database...");

      const response = await axios.post(`${API_URL}/banners/create`, {
        signal: newAbortSignal(),
        data: {
          name: values.name,
          position: values.position,
          aspectRatio: values.aspect_ratio,
          category: filterData.categories.find((category) => category.categoryId === categoryId) || null,
          status: getStatusId(values),
          link: values.link,
          activationDate: values.date_range.from,
          expirationDate: values.date_range.to,
          includeButton: values.include_button,
        },
      });

      updateStage("Uploading banner...");
      await uploadImageToFirebase(`banners/${response.data.object.bannerId}`, image);

      const { message, action } = response.data;
      showSuccessToast(action, `Banner "${values.name}" successfully created.`);
      setTimeout(() => {
        form.reset();
        setImage("");
        resetFormStatus();
      }, 1000);
    } catch (error) {
      resetFormStatus();
      if (error?.response?.data?.errorCode === 409) {
        form.setError("name", { message: "Banner with this name already exists." });
      } else {
        console.error("Form validation failed:", error);
      }
      showErrorToast(error.response.data.action, parse(error.response.data.message));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [categoryData] = await fetchFilterData();
      setFilterData({ categories: categoryData });
    };
    fetchData();
  }, [categoryId]);

  useEffect(() => {
    const categoryId = findId(filterData.categories, selectedCategory, "categoryId");

    setCategoryId(categoryId);
  }, [selectedCategory, filterData]);

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
          <div className="flex flex-col gap-8 py-4 w-full border-b min-w-[360px]">
            <div className="md:px-0 flex justify-start gap-4 xs:items-start sm:items-center flex-row md:mx-6 mx-4">
              <BackArrow link="../banners" />
              <PageHeader title="New Banner" />
              <div className="ml-auto space-x-2">
                <Button type="button" onClick={form.handleSubmit(handleFormSubmit)} className="w-full" disabled={isSubmitting}>
                  {stage}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-8 flex-col lg:p-6 p-4">
            <Card className="w-full border h-fit rounded-md">
              <CardHeader>
                <CardTitle>Banner Information</CardTitle>
                <CardDescription>Enter key banner details for comprehensive information.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="flex xl:flex-row xl:gap-20 gap-4 flex-wrap">
                    <div className="flex flex-col xl:w-1/4 w-full gap-4">
                      <NoValidationInputFile label="Banner Image" id="banner_image" setImage={setImage} />
                      <InputFormItem
                        label="Banner Name"
                        id="name"
                        placeholder="All products eligible for discount with a promotional code."
                        form={form}
                        required
                        description="Enter the name of the banner. Will be used as banner title."
                      />
                      <SelectFormItem
                        label="Position"
                        id="position"
                        placeholder="Search positions..."
                        description="Select corresponding position to the banner."
                        required
                        form={form}
                        data={["Homepage", "Category"]}
                        selectedValue={selectedPosition}
                        setSelectedValue={setSelectedPositionAndUpdateCategory}
                      />
                      {selectedPosition === "category" && (
                        <SelectFormItem
                          label="Category"
                          id="category"
                          placeholder="Search categories..."
                          description="Select corresponding category to the banner."
                          required
                          form={form}
                          data={filterData.categories}
                          selectedValue={selectedCategory}
                          setSelectedValue={setSelectedCategory}
                        />
                      )}
                    </div>
                    <div className="flex flex-col xl:w-1/4 w-full gap-4">
                      <SelectFormItem
                        label="Aspect Ratio"
                        id="aspect_ratio"
                        placeholder="Search aspect ratios..."
                        description="Select corresponding aspect ratio to the banner."
                        required
                        form={form}
                        data={["Horizontal", "Vertical"]}
                        selectedValue={selectedAspectRatio}
                        setSelectedValue={setSelectedAspectRatio}
                      />
                      <SelectFormItem
                        label="Status"
                        id="status"
                        placeholder="Search statuses..."
                        description="Select corresponding status to the banner."
                        required
                        form={form}
                        data={["Active", "Draft", "Archived"]}
                        selectedValue={selectedStatus}
                        setSelectedValue={setSelectedStatus}
                      />
                      <DateRangeFormItem
                        label="Date (7 days default)"
                        id="date_range"
                        description="Choose the date range for displaying the banner. The banner will automatically switch to active status when the specified time arrives."
                        required
                        form={form}
                        date={date}
                        setDate={setDate}
                      />
                    </div>
                    <div className="flex flex-col xl:w-1/4 w-full gap-4">
                      <InputFormItem
                        label="Redirect Link"
                        id="link"
                        type="url"
                        pattern="https://.*"
                        placeholder="Enter the URL for redirection on click"
                        description="Specify the URL where users will be redirected upon clicking the banner."
                        form={form}
                      />
                      {form.getValues("link").length > 0 && (
                        <CheckboxFormItem
                          label="Include URL Button"
                          id="include_button"
                          description="If checked, a button appears in the banner's bottom left corner. Clicking this button redirects the user, but the banner itself remains non-clickable."
                          form={form}
                        />
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            <BannerPreview image={image} form={form} />
          </div>
        </div>
      </div>
    </>
  );
}
