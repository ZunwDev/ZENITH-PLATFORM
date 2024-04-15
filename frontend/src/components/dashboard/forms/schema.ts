import { z } from "zod";

export const FormSchema = z.object({
  name: z.string().min(1).max(64),
  description: z.string().min(1).max(512),
  price: z.coerce.number().min(1),
  discount: z.coerce.number().min(0).max(90).optional(),
  quantity: z.coerce.number().min(1),
  category: z.string().min(1, "You must specify the category of product."),
  brand: z.string().min(1, "You must specify the brand of product."),
  type: z.string().min(1, "You must specify the type of product.").optional(),
  status: z.string().min(1, "You must specify the status of product."),
});

export const ActionDialogSchema = z.object({
  name: z.string().min(1).max(64),
  categoryId: z.coerce.number().optional(),
  attributeTypeId: z.coerce.number().optional(),
});

export const BannerSchema = z
  .object({
    name: z.string().min(1, "You must specify the name of banner."),
    aspect_ratio: z.string().min(1, "You must specify the aspect ratio of the banner."),
    position: z.string().min(1, "You must specify the position where the banner will be shown."),
    status: z.string().min(1, "You must specify the status of the banner."),
    category: z.string().min(1, "You must specify the category.").optional().or(z.literal("")),
    date_range: z.object(
      {
        from: z.date(),
        to: z.date(),
      },
      {
        required_error: "Please select a date range",
      }
    ),
    link: z.coerce.string().url("Please insert a valid URL.").optional().or(z.literal("")),
    include_button: z.boolean().optional(),
  })
  .refine((data) => data.date_range.from < data.date_range.to, {
    path: ["date_range"],
    message: "From date must be before to date",
  });
