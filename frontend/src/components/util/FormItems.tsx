import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";

const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
  (e.target as HTMLInputElement).blur();
};

export function InputFormItem({
  id,
  label,
  placeholder,
  description,
  form,
  type = "text",
  suffix = "",
  prefix = "",
  required = false,
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
          className={cn("border border-border rounded-md p-2", {
            "rounded-tl-none rounded-bl-none border-l-0": prefix,
            "rounded-tr-none rounded-br-none border-r-0": suffix,
          })}
          {...rest}
        />
        {suffix && (
          <div
            className={cn(
              "bg-accent h-[38px] w-16 flex mb-[0.5px] justify-center items-center border rounded-tr-md rounded-br-md"
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
      <FormMessage>{form.formState.errors[id]?.message}</FormMessage>
    </FormItem>
  );
}

export function CheckboxFormItem({ id, label, description, form, data, ...rest }) {
  const initialValue = data && data.archived.archivedId === 1;
  const [isChecked, setIsChecked] = useState(initialValue);

  const handleCheckboxChange = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    form.setValue(id, newValue ? true : false);
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
          onCheckedChange={handleCheckboxChange}
        />
        <FormLabel htmlFor={id}>{label}</FormLabel>
      </div>
      {description && <FormDescription>{description}</FormDescription>}
    </FormItem>
  );
}

export function SelectFormItem({
  id,
  label,
  placeholder,
  description,
  form,
  required = false,
  data,
  selectedValue,
  setSelectedValue,
  ...rest
}) {
  const [open, setOpen] = useState(false);

  return (
    <FormItem className="flex flex-col space-y-2">
      <FormLabel htmlFor={id} isRequired={required}>
        {label}
      </FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" name={`${id}Select`} aria-expanded={open}>
            {selectedValue && data
              ? data.includes(selectedValue)
                ? selectedValue
                : data.find((item) => typeof item === "object" && item.name.toLowerCase() === selectedValue.toLowerCase())
                    ?.name || data.find((item) => item.toLowerCase() === selectedValue.toLowerCase())
              : `Select ${id}...`}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn({ "h-96": data.length > 10 })}>
          <Command>
            <CommandInput placeholder={placeholder} />
            <ScrollArea className={cn({ "h-96": data.length > 10 })}>
              <CommandEmpty>No {id} found.</CommandEmpty>
              <CommandGroup>
                {data.map((item, index) => (
                  <CommandItem
                    key={item.name + "/" + index}
                    id={id}
                    name={id}
                    value={item.name || item}
                    {...form.register(id)}
                    onSelect={(currentValue) => {
                      setSelectedValue(currentValue);
                      form.setValue(id, currentValue);
                      setOpen(false);
                    }}
                    {...rest}>
                    {item.name || item}
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
  placeholder,
  description,
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
          className={cn("border border-border rounded-md p-2", {
            "rounded-tl-none rounded-bl-none border-l-0": prefix,
            "rounded-tr-none rounded-br-none border-r-0": suffix,
          })}
          {...rest}
        />
        {suffix && (
          <div
            className={cn(
              "bg-accent h-[38px] w-16 flex mb-[0.5px] justify-center items-center border rounded-tr-md rounded-br-md",
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
    return <div>Loading...</div>;
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
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
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
