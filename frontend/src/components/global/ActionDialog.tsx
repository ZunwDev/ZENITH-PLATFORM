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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useErrorToast, useSuccessToast } from "@/hooks";
import { API_URL } from "@/lib/api";
import { newAbortSignal } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosRequestConfig } from "axios";
import parse from "html-react-parser";
import { PlusIcon, Trash } from "lucide-react";
import { useCallback } from "react";
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

interface ActionDialogTypes {
  fetchData;
  title: string;
  item?: AttributeType | Attribute | any;
  actionType?: "edit" | "add" | "delete" | "specialedit";
  endpoint?: "categories" | "brands" | "attributes" | "attribute_types";
  attributeId: string;
}

export default function ActionDialog({
  fetchData,
  title,
  item = {},
  attributeId,
  endpoint,
  actionType = "edit",
}: ActionDialogTypes) {
  const showErrorToast = useErrorToast();
  const showSuccessToast = useSuccessToast();

  const form = useForm<z.infer<typeof ActionDialogSchema>>({
    mode: "onChange",
    resolver: zodResolver(ActionDialogSchema),
    defaultValues: {
      name: actionType === "edit" ? item.name : "",
      attributeTypeId: item.attributeTypeId,
      categoryId: item.categoryId,
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
    [fetchData]
  );

  const handleSubmit = useCallback(
    (values: z.infer<typeof ActionDialogSchema>) => {
      switch (actionType) {
        case "edit":
          handleRequest("put", endpoint, values, item[attributeId], item.name);
          break;
        case "add":
          handleRequest("post", endpoint, values);
          break;
      }
    },
    [actionType, handleRequest, endpoint, item, attributeId]
  );

  const handleDelete = useCallback((attributeId: number) => {
    handleRequest("delete", endpoint, null, attributeId);
  }, []);

  const handleClose = useCallback(() => {
    form.handleSubmit(handleSubmit)();
  }, [form, handleSubmit]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {actionType === "edit" ? (
          <div className="w-fit min-w-16 border py-4 px-2 justify-center items-center flex flex-row rounded-xl hover:shadow-lg transition hover:cursor-pointer relative">
            <span className="truncate">
              <strong className="bg-muted p-2 rounded-full text-sm">#{item[attributeId]}</strong> {item?.name}
            </span>
          </div>
        ) : (
          <Button className="ml-auto rounded-full w-8 h-8 border" size="icon" variant="ghost">
            <PlusIcon className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{actionType === "edit" ? "Edit " + title : "New " + title}</DialogTitle>
          <DialogDescription>
            {actionType === "edit" ? (
              <>
                <span>
                  Make changes to {title.toLowerCase()} <strong>{item?.name}</strong>. Click <strong>save changes</strong> when
                  you're done.
                </span>
              </>
            ) : (
              <>
                <span>You are about to add a new {title.toLowerCase()}</span>. Click <strong>add</strong> when you're done
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              {endpoint === "attributes" && (
                <>
                  <Label htmlFor="id" className="text-right">
                    Attribute ID:
                  </Label>
                  <Input id="id" defaultValue={item[attributeId]} className="col-span-3 border rounded-md" disabled />
                  <Label htmlFor="attributetype" className="text-right">
                    Attribute Type ID:
                  </Label>
                  <Input
                    id="id"
                    defaultValue={item.attributeTypeId}
                    className="col-span-3 border rounded-md"
                    {...form.register("attributeTypeId")}
                    disabled
                  />
                </>
              )}

              <Label htmlFor="name" className="text-right">
                Name:
              </Label>
              <Input
                id="name"
                defaultValue={item.name}
                {...form.register("name")}
                autoFocus
                className="col-span-3 border rounded-md"
                maxLength={64}
              />
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
                    This action cannot be undone. This will permanently delete attribute <strong>{item.name}</strong>.{" "}
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
