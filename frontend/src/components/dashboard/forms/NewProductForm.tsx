import { Button } from "@/components/ui/button";
import { Form, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Brand, Category } from "../products/interfaces";
import { cn, debounce, newAbortSignal } from "@/lib/utils";
import axios from "axios";
import { API_URL } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CommandInput, CommandEmpty, CommandGroup, CommandItem, Command } from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "You must specify product name.",
  }),
  description: z.string().min(1, {
    message: "You must specify product description.",
  }),
  price: z
    .number()
    .nullable()
    .refine((val) => val !== null && val >= 1, {
      message: "You must specify product price in USD",
    }),
  discount: z.number().optional(),
  quantity: z
    .number()
    .nullable()
    .refine((val) => val !== null && val >= 1, {
      message: "You must specify the quantity of product.",
    }),
  category: z.string().min(1, {
    message: "You must specify the category of product.",
  }),
  brand: z.string().min(1, {
    message: "You must specify the brand of product.",
  }),
});

export default function NewProductForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [openCategory, setOpenCategory] = useState(false);
  const [openBrands, setOpenBrands] = useState(false);
  const [categoriesSelectedValue, setCategoriesSelectedValue] = useState("");
  const [brandsSelectedValue, setBrandsSelectedValue] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: null,
      discount: 0,
      quantity: null,
      category: "",
      brand: "",
    },
  });

  const debouncedFetchFilters = useMemo(
    () =>
      debounce(async () => {
        try {
          const [categoriesResponse, brandsResponse] = await Promise.all([
            axios.get(`${API_URL}/products/category`, {
              signal: newAbortSignal(5000),
            }),
            axios.get(`${API_URL}/products/brand`, {
              signal: newAbortSignal(5000),
            }),
          ]);
          setCategories(categoriesResponse.data);
          setBrands(brandsResponse.data);
        } catch (error) {
          console.error("Error fetching products:", error.response?.data?.message || error.message);
          setCategories([]);
          setBrands([]);
        }
      }, 250),
    []
  );

  useEffect(() => {
    debouncedFetchFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //const handleNewProjectClick = async (values: z.infer<typeof FormSchema>) => {};

  return (
    <div className="flex flex-col gap-20">
      <div className="md:px-0 px-4 flex justify-between flex-row border-b pb-4">
        <div className="flex flex-col gap-1 xs:mx-auto xs:text-center sm:mx-0 sm:text-start">
          <h1 className="text-3xl font-bold w-full">New Product</h1>
          <h2>Add new product to ZENITH store</h2>
        </div>
      </div>
      <div className="flex flex-row gap-8">
        <div className="w-80 h-96 border rounded-md flex flex-col flex-shrink-0">
          <div className="flex flex-wrap mb-auto justify-center w-full items-center h-full">No images yet...</div>
          <Input type="file"></Input>
        </div>
        <div className="w-full border h-full rounded-md">
          <Form {...form}>
            <form className="p-6 flex flex-row gap-8">
              <div className="flex flex-col w-1/3 gap-4">
                <FormItem>
                  <FormLabel htmlFor="name" isRequired>
                    Product Name
                  </FormLabel>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="HP EliteBook 650 G10"
                    {...form.register("name")}
                    className={cn("border border-border rounded-lg")}
                  />
                  <FormDescription className="text-sm text-gray-500 mt-1">Enter the name of the product.</FormDescription>
                  <FormMessage>{form.formState.errors["name"]?.message}</FormMessage>
                </FormItem>
                <FormItem>
                  <FormLabel htmlFor="description" isRequired>
                    Product Description
                  </FormLabel>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder={
                      'Notebook - Intel Core i5 1345U Raptor Lake, 15.6" IPS anti-glare 1920×1080, RAM 16GB DDR4, Intel Iris Xe Graphics, SSD 512GB, numeric keypad, backlit keypad, webcam, USB 3.2 Gen 1, USB-C, fingerprint reader, WiFi 6E, WiFi, Bluetooth, Weight 1.78 kg, Windows 11 Pro'
                    }
                    {...form.register("description")}
                    className="h-full"
                  />
                  <FormDescription className="text-sm text-gray-500 mt-1">
                    Briefly describe the product and its main features.
                  </FormDescription>
                  <FormMessage>{form.formState.errors["description"]?.message}</FormMessage>
                </FormItem>
              </div>
              <div className="flex flex-col w-1/4 gap-4">
                <FormItem>
                  <FormLabel htmlFor="price" isRequired>
                    Price
                  </FormLabel>
                  <div className="flex flex-row items-center">
                    <div className="bg-accent p-1.5 border rounded-tl-lg rounded-bl-lg">$</div>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="49.99"
                      {...form.register("price")}
                      className={cn("border border-border rounded-tr-lg rounded-br-lg border-l-0")}
                    />
                  </div>
                  <FormDescription className="text-sm text-gray-500 mt-1">
                    Specify the price of the product. Always end the price with 9 (e.g., 49).
                  </FormDescription>
                  <FormMessage>{form.formState.errors["price"]?.message}</FormMessage>
                </FormItem>

                <FormItem>
                  <FormLabel htmlFor="discount">Discount</FormLabel>
                  <div className="flex flex-row items-center">
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      placeholder="20"
                      {...form.register("discount")}
                      className={cn("border border-border rounded-tl-lg rounded-bl-lg border-r-0")}
                    />
                    <div className="bg-accent p-1.5 border rounded-tr-lg rounded-br-lg">%</div>
                  </div>
                  <FormDescription className="text-sm text-gray-500 mt-1">
                    Set the discount percentage for the product (e.g., 20 for 20% off).
                  </FormDescription>
                </FormItem>
                <FormItem>
                  <FormLabel htmlFor="quantity" isRequired>
                    Quantity
                  </FormLabel>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="100"
                    {...form.register("quantity")}
                    className={cn("border border-border rounded-lg")}
                  />
                  <FormDescription className="text-sm text-gray-500 mt-1">
                    Enter the quantity of the product in stock.
                  </FormDescription>
                  <FormMessage>{form.formState.errors["quantity"]?.message}</FormMessage>
                </FormItem>
              </div>
              <div className="flex flex-col w-1/4 gap-4">
                <FormItem className="flex flex-col gap-2">
                  <FormLabel htmlFor="category" isRequired>
                    Category
                  </FormLabel>
                  <Popover open={openCategory} onOpenChange={setOpenCategory}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={openCategory}>
                        {categoriesSelectedValue
                          ? categories.find((category) => category.name.toLowerCase() === categoriesSelectedValue.toLowerCase())
                              ?.name
                          : "Select category..."}
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search categories..." />

                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((item, index) => (
                            <CommandItem
                              key={item.name + "/" + index}
                              value={item.name}
                              {...form.register("category")}
                              onSelect={(currentValue) => {
                                setCategoriesSelectedValue(currentValue);
                                form.setValue("category", currentValue);
                                setOpenCategory(false);
                              }}>
                              {item.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-sm text-gray-500 mt-1">
                    Select corresponding category to the product.
                  </FormDescription>
                  <FormMessage>{form.formState.errors["category"]?.message}</FormMessage>
                </FormItem>
                <FormItem className="flex flex-col gap-2">
                  <FormLabel htmlFor="brand" isRequired>
                    Brand
                  </FormLabel>
                  <Popover open={openBrands} onOpenChange={setOpenBrands}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={openBrands}>
                        {brandsSelectedValue
                          ? brands.find((brand) => brand.name.toLowerCase() === brandsSelectedValue.toLowerCase())?.name
                          : "Select brand..."}
                        <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 h-96 overflow-y-auto">
                      <Command>
                        <CommandInput placeholder="Search brands..." />
                        <ScrollArea className="h-96">
                          <CommandEmpty>No brand found.</CommandEmpty>
                          <CommandGroup>
                            {brands.map((item, index) => (
                              <CommandItem
                                key={item.name + "/" + index}
                                value={item.name}
                                {...form.register("brand")}
                                onSelect={(currentValue) => {
                                  setBrandsSelectedValue(currentValue);
                                  form.setValue("brand", currentValue);
                                  setOpenBrands(false);
                                }}>
                                {item.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </ScrollArea>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-sm text-gray-500 mt-1">
                    Select corresponding brand to the product.
                  </FormDescription>
                  <FormMessage>{form.formState.errors["brand"]?.message}</FormMessage>
                </FormItem>
              </div>
              {/*               <Button type="submit" onClick={form.handleSubmit(handleNewProjectClick)} className="mt-4">
                Create
              </Button> */}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
