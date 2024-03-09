import { cn } from "@/lib/utils";
import { FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CommandInput, CommandEmpty, CommandGroup, CommandItem, Command } from "../ui/command";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";

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
        {prefix && <div className="bg-accent p-1.5 border rounded-tl-md rounded-bl-md">{prefix}</div>}
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          {...form.register(id)}
          className={cn("border border-border rounded-md p-2", {
            "rounded-tl-none rounded-bl-none border-l-0": prefix,
            "rounded-tr-none rounded-br-none border-r-0": suffix,
          })}
          {...rest}
        />
        {suffix && <div className="bg-accent p-1.5 border rounded-tr-md rounded-br-md">{suffix}</div>}
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const initialValue = data && data.archived.archivedId === 1;
  const [isChecked, setIsChecked] = useState(initialValue);

  const handleCheckboxChange = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    form.setValue(id, newValue ? true : false);
  };

  return (
    <FormItem>
      <div className="flex flex-row gap-1">
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
  open,
  setOpen,
  selectedValue,
  setSelectedValue,
  ...rest
}) {
  return (
    <FormItem className="flex flex-col space-y-2">
      <FormLabel htmlFor={id} isRequired={required}>
        {label}
      </FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" name={`${id}Select`} aria-expanded={open}>
            {selectedValue
              ? data.find((item) => item.name.toLowerCase() === selectedValue.toLowerCase())?.name
              : `Select ${id}...`}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("p-0", { "h-96": data.length > 10 })}>
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
                    value={item.name}
                    {...form.register(id)}
                    onSelect={(currentValue) => {
                      setSelectedValue(currentValue);
                      form.setValue(id, currentValue);
                      setOpen(false);
                    }}
                    {...rest}>
                    {item.name}
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
