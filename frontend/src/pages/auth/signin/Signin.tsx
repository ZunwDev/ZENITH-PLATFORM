import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { LoginForm } from "@/components/auth";

export default function Login() {
  useEffect(() => {
    if (Cookies.get("firstName") !== undefined) {
      window.location.href = "/";
    }
  }, []);
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="mb-2">Sign In</CardTitle>
          <CardDescription className="font-semibold">Shopped with us before?</CardDescription>
          <CardDescription className="!mb-2">Use the information you provided in store.</CardDescription>
          <CardDescription className="flex gap-1">
            <span>Don't have an account?</span>
            <a className="justify-center flex text-primary hover:underline" href="/auth/access">
              Get started
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="w-full justify-center flex text-muted-foreground text-sm">Don't have a **** account?</p>
          <Link className="w-full justify-center flex text-primary hover:underline text-sm" to={"/auth/access"}>
            Create an account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
