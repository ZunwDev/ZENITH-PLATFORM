import { Signin, Signup } from "@/pages/auth";

export const AuthRoutes = [
  { path: "/auth/access", element: <Signup /> },
  { path: "/auth/signin", element: <Signin /> },
];
