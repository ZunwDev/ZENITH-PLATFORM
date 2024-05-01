import { createBrowserRouter } from "react-router-dom";
import { AuthRoutes, DashboardRoutes, OtherRoutes } from "./routes";

const routerConfig = [...AuthRoutes, ...DashboardRoutes, ...OtherRoutes];
const router = createBrowserRouter(routerConfig);

export default router;
