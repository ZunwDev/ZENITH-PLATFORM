import { Attributes, Banners, Orders, Overview, Products } from "@/pages/dashboard";
import { EditBanner, EditProduct } from "@/pages/dashboard/edit";
import { NewBanner, NewProduct } from "@/pages/dashboard/new";
import { Settings } from "lucide-react";

const dashboard = "/:userId/dashboard";
export const DashboardRoutes = [
  { path: `${dashboard}/orders`, element: <Orders /> },
  { path: `${dashboard}/settings`, element: <Settings /> },
  { path: `${dashboard}/overview`, element: <Overview /> },
  { path: `${dashboard}/products`, element: <Products /> },
  { path: `${dashboard}/banners`, element: <Banners /> },
  { path: `${dashboard}/banners/new`, element: <NewBanner /> },
  { path: `${dashboard}/banners/edit/:bannerId`, element: <EditBanner /> },
  { path: `${dashboard}/products/new`, element: <NewProduct /> },
  { path: `${dashboard}/products/edit/:productId`, element: <EditProduct /> },
  { path: `${dashboard}/attributes`, element: <Attributes /> },
];
