import { z } from "zod";

export const FormSchema = z.object({
  name: z.string().min(1).max(64),
  description: z.string().min(1).max(512),
  price: z.coerce.number().min(1),
  discount: z.coerce.number().min(0).max(90).optional(),
  quantity: z.coerce.number().min(1),
  category: z.string().min(1, {
    message: "You must specify the category of product.",
  }),
  brand: z.string().min(1, {
    message: "You must specify the brand of product.",
  }),
  type: z.string().min(1, { message: "You must specify the type of product." }).optional(),
  status: z.string().min(1, {
    message: "You must specify the status of product.",
  }),
});

export const ActionDialogSchema = z.object({
  name: z.string().min(1).max(64),
  categoryId: z.coerce.number().optional(),
  attributeTypeId: z.coerce.number().optional(),
});
