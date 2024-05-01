import { Attributes, Banners, Orders, Overview, Products } from "@/pages/dashboard";
import { EditBannerForm, EditProductForm } from "@/pages/dashboard/edit";
import { NewBannerForm, NewProductForm } from "@/pages/dashboard/new";
import { Settings } from "lucide-react";

const dashboard = "/:userId/dashboard";
export const DashboardRoutes = [
  { path: `${dashboard}/orders`, element: <Orders /> },
  { path: `${dashboard}/settings`, element: <Settings /> },
  { path: `${dashboard}/overview`, element: <Overview /> },
  { path: `${dashboard}/products`, element: <Products /> },
  { path: `${dashboard}/banners`, element: <Banners /> },
  { path: `${dashboard}/banners/new`, element: <NewBannerForm /> },
  { path: `${dashboard}/banners/edit/:bannerId`, element: <EditBannerForm /> },
  { path: `${dashboard}/products/new`, element: <NewProductForm /> },
  { path: `${dashboard}/products/edit/:productId`, element: <EditProductForm /> },
  { path: `${dashboard}/attributes`, element: <Attributes /> },
];
