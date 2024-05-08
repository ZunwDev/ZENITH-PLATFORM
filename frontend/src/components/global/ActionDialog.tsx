import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useErrorToast, useSuccessToast } from "@/hooks";
import { API_URL, newAbortSignal } from "@/lib/api";
import { getImageByIdFromFirebase, updateImageInFirebase } from "@/lib/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosRequestConfig } from "axios";
import parse from "html-react-parser";
import { PlusIcon, Trash } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Attribute, AttributeType } from "../dashboard/attributes/interface";
import { ActionDialogSchema } from "../dashboard/forms";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Form } from "../ui/form";
import { Label } from "../ui/label";
import { InputFormItem, NoValidationInputFile, NoValidationInputFormItem } from "../util";

interface ActionDialogTypes {
  fetchData;
  title: string;
  item?: AttributeType | Attribute | any;
  isShowID?: boolean;
  actionType?: "edit" | "add" | "delete";
  endpoint?: "categories" | "brands" | "attributes" | "attribute_types" | "product_types";
  attributeId: string;
}

export default function ActionDialog({
  fetchData,
  title,
  isShowID,
  item = {},
  attributeId,
  endpoint,
  actionType = "edit",
}: ActionDialogTypes) {
  const showErrorToast = useErrorToast();
  const showSuccessToast = useSuccessToast();
  const [image, setImage] = useState("");

  const form = useForm<z.infer<typeof ActionDialogSchema>>({
    mode: "onChange",
    resolver: zodResolver(ActionDialogSchema),
    defaultValues: {
      name: actionType === "edit" ? item.name : "",
      attributeTypeId: item.attributeTypeId,
      categoryId: item.categoryId || null,
    },
  });

  const handleRequest = useCallback(
    async (
      method: "post" | "put" | "delete",
      endpoint: string,
      values?: z.infer<typeof ActionDialogSchema>,
      id?: number,
      oldValue?: string
    ) => {
      try {
        if (endpoint === "categories") {
          await updateImageInFirebase(`category_images/${item?.categoryId}`, image);
        }

        const { name, categoryId, attributeTypeId } = values || {};
        const url = `${API_URL}/${endpoint}${["delete", "put"].includes(method) ? `/${id}` : ""}`;
        const requestData = method === "post" || method === "put" ? { name, categoryId, attributeTypeId, oldValue } : {};

        const config: AxiosRequestConfig = {
          ...(method === "post" || method === "put" ? { data: requestData } : {}),
          ...(method !== "delete" && { signal: newAbortSignal() }),
        };

        const response = await axios[method](url, config);
        fetchData();

        const { message, action } = response.data;
        if (message && action) {
          showSuccessToast(action, parse(message));
        }
      } catch (error) {
        showErrorToast(null, parse(error.response.data.message));
      }
    },
    [fetchData, image]
  );

  const handleSubmit = async (values: z.infer<typeof ActionDialogSchema>) => {
    try {
      await ActionDialogSchema.parse(values);
      switch (actionType) {
        case "edit":
          await handleRequest("put", endpoint, values, item[attributeId], item.name);
          break;
        case "add":
          await handleRequest("post", endpoint, values);
          break;
      }
    } catch (error) {
      // Handle any errors here
      console.error("Error occurred:", error);
    }
  };

  const handleDelete = useCallback((attributeId: number) => {
    handleRequest("delete", endpoint, null, attributeId);
  }, []);

  const handleClose = useCallback(() => {
    form.handleSubmit(handleSubmit)();
    form.reset();
  }, [form, handleSubmit]);

  const handleCategoryChange = async () => {
    // Load image if it's empty
    if (!image) {
      const fetchedImage = await getImageByIdFromFirebase(`category_images`, item?.categoryId);
      if (fetchedImage !== null) {
        setImage(fetchedImage);
      }
    } else {
      // Unload image
      setImage("");
    }
  };

  return (
    <Dialog onOpenChange={endpoint === "categories" && actionType === "edit" ? handleCategoryChange : undefined}>
      <DialogTrigger asChild>
        {actionType === "edit" ? (
          <div className="w-fit min-w-16 border p-1.5 justify-center items-center flex flex-row rounded-xl hover:shadow-lg transition hover:cursor-pointer relative">
            <span className="truncate">
              {isShowID && <strong className="bg-muted p-2 rounded-full text-sm">#{item[attributeId]}</strong>}
              <span className="ml-1">{item?.name}</span>
            </span>
          </div>
        ) : (
          <Button className="ml-auto rounded-full size-8 border" size="icon" variant="ghost">
            <PlusIcon className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{actionType === "edit" ? "Edit " + title : "New " + title}</DialogTitle>
          <DialogDescription>
            {actionType === "edit" ? (
              <span>
                Make changes to {title.toLowerCase()} <strong>{item?.name}</strong>. Click <strong>save changes</strong> when
                you're done.
              </span>
            ) : (
              <span>
                You are about to add a new {title.toLowerCase()}. Click <strong>add</strong> when you're done
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="py-4">
            <div className="flex flex-col gap-2">
              {endpoint === "attributes" && (
                <>
                  {actionType === "edit" && (
                    <NoValidationInputFormItem
                      id="attribute_id"
                      label="Attribute ID"
                      defaultValue={item[attributeId]}
                      disabled></NoValidationInputFormItem>
                  )}
                  <NoValidationInputFormItem
                    id="attribute_id"
                    label="Attribute ID"
                    defaultValue={item.attributeTypeId}
                    disabled></NoValidationInputFormItem>
                </>
              )}

              {endpoint === "product_types" && (
                <InputFormItem
                  id="categoryId"
                  label="Category ID"
                  form={form}
                  type="number"
                  defaultValue={item.categoryId}
                  required
                  className="w-full"></InputFormItem>
              )}

              {endpoint === "categories" && (
                <NoValidationInputFile id="category_image" label="Category Image" setImage={setImage}></NoValidationInputFile>
              )}
              <InputFormItem
                id="name"
                label="Name"
                form={form}
                autoFocus
                maxLength={64}
                defaultValue={item.name}
                required></InputFormItem>
              {endpoint === "categories" && (
                <>
                  <Label>Image</Label>
                  {image ? (
                    <img src={image} className="size-24 object-contain" loading="lazy"></img>
                  ) : (
                    <span className="text-xs text-destructive">No image uploaded yet.</span>
                  )}
                </>
              )}
            </div>
          </div>
        </Form>
        <DialogFooter>
          {actionType === "edit" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="destructive" className="mr-auto">
                  <Trash className="size-6" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete attribute <strong>{item.name}</strong>.
                    {(title.toLowerCase() === "brand" || title.toLowerCase() === "category") && (
                      <span className="text-destructive">
                        This action won't complete if there are products assigned to this attribute
                      </span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button variant="destructive" type="submit" onClick={() => handleDelete(item[attributeId])}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <DialogClose asChild>
            <Button onClick={handleClose}>{actionType === "edit" ? "Save changes" : "Add"}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
