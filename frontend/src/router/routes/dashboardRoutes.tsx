import { EditProductForm, NewProductForm } from "@/components/dashboard/forms";
import NewBannerForm from "@/components/dashboard/forms/NewBannerForm";
import { Attributes, Banners, Orders, Overview, Products } from "@/pages/dashboard";
import { Settings } from "lucide-react";

const dashboard = "/:userId/dashboard";
const routes = {
  orders: `${dashboard}/orders`,
  settings: `${dashboard}/settings`,
  overview: `${dashboard}/overview`,
  products: `${dashboard}/products`,
  banners: `${dashboard}/banners`,
  newBanner: `${dashboard}/banners/new`,
  attributes: `${dashboard}/attributes`,
  newProduct: `${dashboard}/products/new`,
  editProduct: `${dashboard}/products/edit/:productId`,
};

export const DashboardRoutes = [
  {
    path: routes.orders,
    element: <Orders />,
  },
  {
    path: routes.settings,
    element: <Settings />,
  },
  {
    path: routes.overview,
    element: <Overview />,
  },
  {
    path: routes.products,
    element: <Products />,
  },
  {
    path: routes.banners,
    element: <Banners />,
  },
  {
    path: routes.newBanner,
    element: <NewBannerForm />,
  },
  {
    path: routes.attributes,
    element: <Attributes />,
  },
  {
    path: routes.newProduct,
    element: <NewProductForm />,
  },
  {
    path: routes.editProduct,
    element: <EditProductForm />,
  },
];
