import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn, goto } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_URL, LOGIN_ERROR_MESSAGE, LOGIN_INVALID_CREDENTIALS_MESSAGE, LOGIN_SERVER_ERROR_MESSAGE } from "@/lib/constants";
import axios from "axios";
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

      const response = await axios.post(`${API_URL}/users/check-login`, {
        email: values.email,
        password: btoa(values.password),
        isChecked: String(isChecked),
      });

      if (response.status === 200) {
        setIsLogged(true);
        const duration = isChecked ? 30 : 0.25;
        Cookies.set("sessionToken", response.data.sessionToken, { expires: duration, secure: true });
        goto("/", 500); //Redirect user after successful login to homepage in 500ms
      }
    } catch (error) {
      console.error("Login error", error);
      const errorMessage =
        (error.response &&
          {
            401: LOGIN_INVALID_CREDENTIALS_MESSAGE,
            404: LOGIN_ERROR_MESSAGE,
          }[error.response.status]) ||
        LOGIN_SERVER_ERROR_MESSAGE;
      form.setError("email", { message: errorMessage });
      form.setError("password", { message: errorMessage });
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
          {isLogged ? "REDIRECTING IN A MOMENT..." : "LOGIN"}
        </Button>
      </form>
    </Form>
  );
}
