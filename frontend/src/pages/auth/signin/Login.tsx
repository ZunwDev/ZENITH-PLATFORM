import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

function Login() {
  const [isLogged, setIsLogged] = useState(false);
  const keepSignedInCheckbox = useRef(null);

  const FormSchema = z.object({
    email: z.string().email("Invalid email format.").min(2, "Please enter a email address"),
    password: z.string().min(8, "Please enter an password "),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginClick = async (values: z.infer<typeof FormSchema>) => {
    try {
      FormSchema.parse(values);

      const response = await fetch(`${API_URL}/users/check-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (response.status === 401) {
        form.setFocus("email");
        form.setError("email", { message: "Invalid email or password. Please check your credentials and try again." });
        form.setError("password", { message: "Invalid email or password. Please check your credentials and try again." });
        form.resetField("password");
        setIsLogged(false);
        return false;
      }

      if (response.ok) {
        setIsLogged(true);
      }

      const data = await response.json();

      return { data, error: null };
    } catch (error) {
      console.error("Login error", error);
    }
  };
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
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="alan.turing@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-end space-x-2">
                  <Checkbox id="keepsigned" ref={keepSignedInCheckbox} />
                  <Label htmlFor="keepsigned">Keep me signed in</Label>
                </div>
                <Button
                  className={cn("w-full flex flex-row gap-1")}
                  type="submit"
                  disabled={isLogged}
                  onClick={form.handleSubmit(handleLoginClick)}>
                  VERIFY
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p className="w-full justify-center flex text-muted-foreground text-sm">Don't have a **** account?</p>
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
