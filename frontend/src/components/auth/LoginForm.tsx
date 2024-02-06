import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_URL } from "@/lib/constants";
import Cookies from "js-cookie";

const FormSchema = z.object({
  email: z.string().email("Invalid email format.").min(2, "Please enter an email address"),
  password: z.string().min(8, "Please enter a password"),
});

export default function LoginForm() {
  const [isChecked, setIsChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

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
      setIsLogged(true);

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

      const data = await response.json();

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
        if (isChecked) {
          Cookies.set("firstName", data.username, { expires: 77777 });
          Cookies.set("userId", data.userId, { expires: 77777 });
          Cookies.set("roleID", data.roleID, { expires: 77777 });
        } else {
          Cookies.set("firstName", data.username, { expires: 0.5 });
          Cookies.set("userId", data.userId, { expires: 0.5 });
          Cookies.set("roleID", data.roleID, { expires: 0.5 });
        }
        setTimeout(() => {
          window.location.href = "/";
        }, 200);
      }
    } catch (error) {
      console.error("Login error", error);
      setIsLogged(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="alan.turing@example.com" {...form.register("email")} />
          </FormControl>
          <FormMessage>{form.formState.errors.email?.message}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <Input placeholder="••••••••" type="password" {...form.register("password")} />
          </FormControl>
          <FormMessage>{form.formState.errors.password?.message}</FormMessage>
        </FormItem>

        <div className="flex items-center justify-end space-x-2">
          <Checkbox id="KS" onChange={() => setIsChecked(!isChecked)} />
          <Label htmlFor="KS">Remember me</Label>
        </div>

        <Button
          className={cn("w-full flex flex-row gap-1")}
          type="submit"
          disabled={isLogged}
          onClick={form.handleSubmit(handleLoginClick)}>
          LOGIN
        </Button>
      </form>
    </Form>
  );
}
