import { NewBannerForm } from "@/components/dashboard/forms";
import { BannerSchema } from "@/components/dashboard/forms/schema";
import { DashboardPageLayout, PageHeader } from "@/components/dashboard/global";
import { FilterData } from "@/components/dashboard/products/interfaces";
import { Button } from "@/components/ui/button";
import { BackArrow } from "@/components/util";
import { BannerPreview } from "@/components/view/previews";
import { useAdminCheck, useErrorToast, useFormStatus, useSuccessToast } from "@/hooks";
import { API_URL, fetchCategoryIdByName, fetchFilterData, fetchStatusByName, newAbortSignal } from "@/lib/api";
import { NO_IMAGE_PROVIDED_MESSAGE } from "@/lib/constants";
import { uploadImageToFirebase } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { addDays } from "date-fns";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function NewBanner() {
  useAdminCheck();
  const showErrorToast = useErrorToast();
  const showSuccessToast = useSuccessToast();
  const { stage, isSubmitting, updateStage, setSubmittingState, resetFormStatus } = useFormStatus("Create banner");

  const [filterData, setFilterData] = useState<FilterData>({ categories: [] });
  const [image, setImage] = useState("");

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
      const status = await fetchStatusByName(encodeURIComponent(form.getValues("status")));

      const response = await axios.post(`${API_URL}/banners/create`, {
        signal: newAbortSignal(),
        data: {
          name: values.name,
          position: values.position,
          aspectRatio: values.aspect_ratio,
          category: filterData.categories.find((category) => category.categoryId === categoryId) || null,
          status,
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
      const { categories } = await fetchFilterData();
      setFilterData({ categories });
    };
    fetchData();
  }, [categoryId]);

  useEffect(() => {
    const fetchData = async () => {
      const categoryId =
        form.getValues("category") && (await fetchCategoryIdByName(encodeURIComponent(form.getValues("category"))));
      setCategoryId(categoryId);
    };
    fetchData();
  }, [form.getValues("category"), filterData]);

  useEffect(() => {}, [form.watch()]);

  return (
    <DashboardPageLayout>
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
        <NewBannerForm form={form} setImage={setImage} date={date} setDate={setDate} filterData={filterData} />
        <BannerPreview image={image} form={form} />
      </div>
    </DashboardPageLayout>
  );
}
