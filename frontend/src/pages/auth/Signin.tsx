import { LoginForm } from "@/components/auth";
import { Logo } from "@/components/global";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { STORE_NAME } from "@/lib/constants";
import { goto } from "@/lib/utils";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  useEffect(() => {
    if (Cookies.get("sessionToken") !== undefined) {
      goto("/");
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center gap-8 h-screen mb-8">
      <div className="flex flex-row gap-4 items-center">
        <Logo fillColor="black" className="md:size-24 size-12" />
        <p className="md:text-4xl sm:text-lg sm:block hidden tracking-widest font-semibold select-none font-brunoac">
          {STORE_NAME}
        </p>
      </div>
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
          <p className="w-full justify-center flex text-muted-foreground text-sm">Don't have a {STORE_NAME} account?</p>
          <Link className="w-full justify-center flex text-primary hover:underline text-sm" to={"/auth/access"}>
            Create an account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
