import { Banner } from "@/components/dashboard/banners/interfaces";
import { BannerSchema, EditBannerForm } from "@/components/dashboard/forms";
import { DashboardPageLayout, DiscardButton, PageHeader } from "@/components/dashboard/global";
import { FilterData } from "@/components/dashboard/products/interfaces";
import { Button } from "@/components/ui/button";
import { BackArrow } from "@/components/util";
import { BannerPreview } from "@/components/view/previews";
import { useAdminCheck, useErrorToast, useFormStatus, useSuccessToast } from "@/hooks";
import { API_URL, fetchBannerDataById, fetchFilterData, fetchStatusByName, newAbortSignal } from "@/lib/api";
import { NO_IMAGE_PROVIDED_MESSAGE } from "@/lib/constants";
import { getImageFromFirebase, updateImageInFirebase } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

export default function EditBanner() {
  useAdminCheck();
  const { stage, isSubmitting, updateStage, setSubmittingState } = useFormStatus("Save changes");
  const { bannerId } = useParams();
  const showErrorToast = useErrorToast();
  const showSuccessToast = useSuccessToast();

  const form = useForm<z.infer<typeof BannerSchema>>({
    mode: "onChange",
    resolver: zodResolver(BannerSchema),
  });

  const [image, setImage] = useState("");
  const [filterData, setFilterData] = useState<FilterData>({ categories: [] });
  const [bannerData, setBannerData] = useState<Banner>();
  const [date, setDate] = useState<DateRange | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      const { categories } = await fetchFilterData();
      const bannerData = await fetchBannerDataById(bannerId);
      const image = await getImageFromFirebase(`banners/${bannerId}`);

      setImage(image);
      setFilterData({ categories });
      setBannerData(bannerData);
      const { name, position, aspectRatio, link, status, category, activationDate, expirationDate, includeButton } = bannerData;
      setDate({ from: activationDate, to: expirationDate });

      form.setValue("name", name);
      form.setValue("position", position);
      form.setValue("aspect_ratio", aspectRatio);
      form.setValue("link", link);
      form.setValue("category", category?.name || "");
      form.setValue("status", status.name);
      form.setValue("date_range", {
        from: new Date(activationDate),
        to: new Date(expirationDate),
      });
      form.setValue("include_button", includeButton);
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (values: z.infer<typeof BannerSchema>) => {
    try {
      await BannerSchema.parseAsync(values);
      if (image === "") return showErrorToast("Banner Creation", NO_IMAGE_PROVIDED_MESSAGE);

      setSubmittingState(true);
      updateStage("Updating...");
      const statusId = await fetchStatusByName(encodeURIComponent(form.getValues("status")));

      const response = await axios.put(`${API_URL}/banners/${bannerId}`, {
        signal: newAbortSignal(),
        data: {
          name: values.name,
          position: values.position,
          aspectRatio: values.aspect_ratio,
          category:
            filterData.categories.find((category) => category.name.toLowerCase() === values.category.toLowerCase()) || null,
          status: statusId,
          link: values.link,
          activationDate: values.date_range.from,
          expirationDate: values.date_range.to,
          includeButton: values.include_button,
        },
      });

      updateStage("Uploading images...");
      await updateImageInFirebase(`banners/${response.data.data.bannerId}`, image);
      showSuccessToast("Banner Update", `Banner "${values.name}" successfully updated.`);
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
      <main className="flex flex-col py-4 w-full min-w-[360px] border-b">
        <div className="md:px-0 flex justify-start gap-4 xs:items-start sm:items-center flex-row lg:mx-6 mx-4">
          <BackArrow link="../../banners" />
          <PageHeader title="Edit Banner" />
          <div className="ml-auto flex gap-2 md:flex-row flex-col">
            <DiscardButton typeOfDiscard="banner" />
            <Button type="button" onClick={form.handleSubmit(handleFormSubmit)} disabled={isSubmitting}>
              {stage}
            </Button>
          </div>
        </div>
      </main>
      <main className="flex md:flex-row md:gap-8 gap-32 flex-col lg:p-6 p-4">
        <div className="flex flex-col gap-8 w-full">
          <EditBannerForm
            bannerData={bannerData}
            form={form}
            setImage={setImage}
            date={date}
            setDate={setDate}
            filterData={filterData}
          />
          <BannerPreview image={image} form={form} />
        </div>
      </main>
    </DashboardPageLayout>
  );
}
