import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

function Login() {
  return (
    <>
      <div className="w-screen h-[100dvh] flex items-center justify-center">
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="mb-2">Sign In</CardTitle>
            <CardDescription className="font-semibold">Shopped with us before?</CardDescription>
            <CardDescription className="!mb-2">Use the information you provided in store.</CardDescription>
            <CardDescription className="flex gap-1">
              <span className="">Don't have an account?</span>
              <a className="justify-center flex text-primary hover:underline" href="/auth/access">
                Get started
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-8">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email*</Label>
                  <Input id="email" placeholder="" required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password*</Label>
                  <Input id="password" placeholder="" required />
                </div>
                <div className="flex justify-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="keepsigned" />
                    <Label htmlFor="keepsigned">Keep me signed in</Label>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full">SIGN IN</Button>
            <p className="w-full justify-center flex mt-4 text-muted-foreground text-sm">Don't have a **** account?</p>
            <Link className="w-full justify-center flex text-primary hover:underline text-sm" to={"/auth/access"}>
              Create an account
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default Login;
