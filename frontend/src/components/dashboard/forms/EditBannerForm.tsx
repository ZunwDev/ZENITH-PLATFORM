import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { CheckboxFormItem, DateRangeFormItem, InputFormItem, NoValidationInputFile, SelectFormItem } from "@/components/util";
import { useEffect } from "react";

export default function EditBannerForm({ bannerData, form, date, setDate, setImage, filterData }) {
  useEffect(() => {
    const handlePositionChange = () => {
      const currentPosition = form.getValues("position");
      if (currentPosition === "homepage") {
        form.setValue("category", "");
      }
    };
    handlePositionChange();
  }, [form.getValues("position")]);

  return (
    <Card className="w-full border h-fit rounded-md">
      <CardHeader>
        <CardTitle>Product Information</CardTitle>
        <CardDescription>Update key product details for comprehensive information.</CardDescription>
      </CardHeader>
      <CardContent>
        {bannerData && (
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
                />
                {form.getValues("position") === "category" && (
                  <SelectFormItem
                    label="Category"
                    id="category"
                    placeholder="Search categories..."
                    description="Select corresponding category to the banner."
                    required
                    form={form}
                    data={filterData.categories.map((item) => item.name)}
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
                />
                <SelectFormItem
                  label="Status"
                  id="status"
                  placeholder="Search statuses..."
                  description="Select corresponding status to the banner."
                  required
                  form={form}
                  data={["Active", "Draft", "Archived"]}
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
                    checked={form.getValues("include_button")}
                    form={form}
                  />
                )}
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
