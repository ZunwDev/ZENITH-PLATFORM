import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
  (e.target as HTMLInputElement).blur();
};

export function InputFormItem({
  id,
  label,
  placeholder = "",
  description = "",
  form,
  type = "text",
  suffix = "",
  prefix = "",
  required = false,
  className = "",
  ...rest
}) {
  return (
    <FormItem>
      <FormLabel htmlFor={id} className="block" isRequired={required}>
        {label}
      </FormLabel>
      <div className="flex flex-row items-center">
        {prefix && (
          <div
            className={cn(
              "bg-accent h-[38px] w-8 flex mb-[0.5px] justify-center items-center border rounded-tl-md rounded-bl-md"
            )}>
            <span className="text-sm">{prefix}</span>
          </div>
        )}
        <Input
          id={id}
          name={id}
          type={type}
          onWheel={handleWheel}
          placeholder={placeholder}
          {...form.register(id)}
          className={cn(
            "border rounded-md p-2",
            {
              "rounded-tl-none rounded-bl-none border-l-0": prefix,
              "rounded-tr-none rounded-br-none border-r-0": suffix,
            },
            className
          )}
          {...rest}
        />
        {suffix && (
          <div
            className={cn(
              "bg-accent h-[38px] w-12 flex mb-[0.5px] justify-center items-center border rounded-tr-md rounded-br-md truncate"
            )}>
            <span className="text-sm">{suffix}</span>
          </div>
        )}
      </div>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{form.formState.errors[id]?.message}</FormMessage>
    </FormItem>
  );
}

export function TextareaFormItem({ id, label, placeholder, description, form, required = false, ...rest }) {
  return (
    <FormItem>
      <FormLabel htmlFor={id} isRequired={required}>
        {label}
      </FormLabel>
      <Textarea id={id} name={id} placeholder={placeholder} {...form.register(id)} className="h-44" {...rest} />
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{form?.formState?.errors?.[id]?.message}</FormMessage>
    </FormItem>
  );
}

export function CheckboxFormItem({ id, label, description, form, checked = false, ...rest }) {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e);
    form.setValue(id, e);
  };

  return (
    <FormItem>
      <div className="flex flex-row gap-2 items-center">
        <Checkbox
          id={id}
          name={id}
          {...form.register(id)}
          {...rest}
          checked={isChecked}
          onCheckedChange={handleCheckboxChange} // Use onChange instead of onCheckedChange
        />
        <FormLabel htmlFor={id}>{label}</FormLabel>
      </div>
      {description && <FormDescription>{description}</FormDescription>}
    </FormItem>
  );
}

export function DateRangeFormItem({ id, label, description, form, required = false, date, setDate, ...rest }) {
  return (
    <FormItem>
      <FormLabel htmlFor={id} className="block" isRequired={required}>
        {label}
      </FormLabel>
      <div className={cn("grid gap-2")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={id}
              {...form.register(id)}
              variant="outline"
              {...rest}
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 size-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="!w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage>{form.formState.errors[id]?.message}</FormMessage>
    </FormItem>
  );
}

export function SelectFormItem({ id, label, placeholder, description, form, required = false, data, ...rest }) {
  const [open, setOpen] = useState(false);
  const selectedValue = form.getValues(id)?.toLowerCase();
  const selectedItem = data.find((item) => item?.toLowerCase() === selectedValue);
  const buttonText = selectedItem ?? `Select ${id || "default"}...`;

  return (
    <FormItem className="flex flex-col space-y-2">
      <FormLabel htmlFor={id} isRequired={required}>
        {label}
      </FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              name={`${id}Select`}
              aria-expanded={open}
              className={cn({ "text-muted-foreground": !form.getValues(id) })}>
              {buttonText}
              <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className={cn({ "h-96": data?.length > 10 })}>
          <Command>
            <CommandInput placeholder={placeholder} />
            <ScrollArea className={cn({ "h-96": data?.length > 10 })}>
              <CommandEmpty>No {id} found.</CommandEmpty>
              <CommandGroup>
                {data?.map((item, index) => (
                  <CommandItem
                    key={`${item}${index}`}
                    id={id}
                    value={item}
                    onSelect={(currentValue) => {
                      form.setValue(id, currentValue);
                      setOpen(false);
                    }}
                    {...rest}>
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
      <FormDescription>{description}</FormDescription>
      <FormMessage>{form.formState.errors[id]?.message}</FormMessage>
    </FormItem>
  );
}

export function NoValidationInputFormItem({
  id,
  label,
  placeholder = "",
  description = "",
  disabled,
  inputType = "text",
  suffix = "",
  prefix = "",
  ...rest
}) {
  return (
    <>
      <label htmlFor={id} className="block text-sm">
        {label}
      </label>
      <div className="flex flex-row items-center">
        {prefix && <div className="bg-accent p-1.5 border rounded-tl-md rounded-bl-md">{prefix}</div>}
        <Input
          disabled={disabled}
          id={id}
          name={id}
          type={inputType}
          onWheel={handleWheel}
          placeholder={placeholder}
          className={cn("border rounded-md p-2", {
            "rounded-tl-none rounded-bl-none border-l-0": prefix,
            "rounded-tr-none rounded-br-none border-r-0": suffix,
          })}
          {...rest}
        />
        {suffix && (
          <div
            className={cn(
              "bg-accent h-[38px] w-12 flex mb-[0.5px] justify-center items-center border rounded-tr-md rounded-br-md truncate",
              {
                "opacity-50": disabled,
              }
            )}>
            <span className="text-sm">{suffix}</span>
          </div>
        )}
      </div>
      {description && <p>{description}</p>}
    </>
  );
}

export function NoValidationCheckboxFormItem({ id, label, description, disabled, ...rest }) {
  const [checked, setChecked] = useState(rest.defaultChecked || false);

  const handleClick = (e) => {
    e.preventDefault();
    setChecked(!checked);
    if (rest.onChange) {
      rest.onChange(!checked);
    }
  };

  return (
    <>
      <div className="flex flex-row gap-2 items-center">
        <Checkbox id={id} name={id} checked={checked} onClick={handleClick} disabled={disabled} />
        <label className="text-sm" htmlFor={id}>
          {label}
        </label>
      </div>
      {description && <p>{description}</p>}
    </>
  );
}

export function NoValidationSelectFormItem({
  id,
  label,
  asyncFetchData,
  handleSelect,
  section,
  field,
  disabled,
  selectedValue: propSelectedValue,
  data: preloadedData,
}) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(propSelectedValue);
  const [loading, setLoading] = useState(true);
  const [asyncData, setAsyncData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const resolvedData = await asyncFetchData;
        setAsyncData(resolvedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [asyncFetchData]);

  const data = preloadedData || asyncData;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 h-screen text-center w-full">
        <ScaleLoader color="#2563eb" />
        Loading products...
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={id} className="block text-sm">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" name={`${id}Select`} aria-expanded={open} disabled={disabled}>
            {(data?.length > 0 && data?.find((item) => item?.toLowerCase() === selectedValue?.toLowerCase())) ||
              `Select ${label}...`}
            <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn({ "h-96": data?.length > 10 })}>
          <Command>
            <CommandInput placeholder={`Search ${label}...`} />
            <ScrollArea className={cn({ "h-96": data?.length > 10 })}>
              <CommandEmpty>No {label} found.</CommandEmpty>
              <CommandGroup>
                {data &&
                  data.map((item, index) => (
                    <CommandItem
                      key={index}
                      id={id}
                      value={item.name || item}
                      onSelect={(currentValue) => {
                        setSelectedValue(currentValue);
                        setOpen(false);
                        handleSelect(
                          section,
                          data.find((item) => item?.toLowerCase() === currentValue?.toLowerCase()),
                          field
                        );
                      }}>
                      {item.name || item}
                    </CommandItem>
                  ))}
                <CommandItem
                  onSelect={(currentValue) => {
                    setSelectedValue("");
                    setOpen(false);
                    handleSelect(
                      section,
                      data.find((item) => item?.toLowerCase() === currentValue?.toLowerCase()),
                      field
                    );
                  }}>
                  None
                </CommandItem>
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function NoValidationInputFile({ id, label, setImage }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl); // Store the blob URL instead of the file object
    }
  };

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="file"
        className="border w-full rounded-md"
        onChange={handleFileChange}
        accept=".png, .jpg, .jpeg, .webp"
      />
    </div>
  );
}
