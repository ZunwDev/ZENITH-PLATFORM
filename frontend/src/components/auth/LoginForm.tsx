import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn, goto, setCookies } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_URL, LOGIN_ERROR_MESSAGE } from "@/lib/constants";

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

      if (response.ok) {
        const data = await response.json();
        setIsLogged(true);

        isChecked ? setCookies(data, 77777) : setCookies(data, 0.25); //If user checks remember me, set the cookies for really long time, if not only quarter of a day
        goto("/", 200); //Redirect user to "/" in 200ms
      } else if (response.status === 404 || response.status === 401) {
        form.setError("email", { message: LOGIN_ERROR_MESSAGE });
        form.setError("password", { message: LOGIN_ERROR_MESSAGE });
        setIsLogged(false);
        return false;
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
