import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { InputFormItem, SelectFormItem, TextareaFormItem } from "@/components/util";

export default function EditProductForm({ productData, form, filterData }) {
  return (
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
                  data={filterData.categories.map((item) => item.name)}></SelectFormItem>
                <SelectFormItem
                  label="Brand"
                  id="brand"
                  placeholder="Search brands..."
                  description="Select corresponding brand to the product."
                  required
                  form={form}
                  data={filterData.brands.map((item) => item.name)}></SelectFormItem>
                <SelectFormItem
                  label="Status"
                  id="status"
                  placeholder="Search statuses..."
                  description="Select corresponding status to the product."
                  required
                  form={form}
                  data={["Active", "Draft", "Archived"]}
                />
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
