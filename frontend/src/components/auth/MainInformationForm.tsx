import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API_URL, newAbortSignal } from "@/lib/api";
import { ACCOUNT_CREATE_SERVER_ERROR_MESSAGE, ACCOUNT_CREATE_USER_EXISTS_MESSAGE } from "@/lib/constants";
import { generateOTP, setStateDelayed } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import bcrypt from "bcryptjs";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface MainInfoFormProps {
  setFirstPhase: React.Dispatch<React.SetStateAction<boolean>>;
  setVerifyCode: React.Dispatch<React.SetStateAction<string>>;
  setUserId: React.Dispatch<React.SetStateAction<number>>;
}

export default function MainInformationForm({ setFirstPhase, setVerifyCode, setUserId }: MainInfoFormProps) {
  const FormSchema = z
    .object({
      email: z.string().email("Invalid email format."),
      firstName: z.string().min(2, "First name must be at least 2 characters long"),
      lastName: z.string().min(2, "Last name must be at least 2 characters long"),
      password: z
        .string()
        .regex(
          /^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
          "Password must contain at least three lowercase letter, two uppercase letter, two digits, one special character, and be at least 8 characters long"
        ),
      confirmPassword: z.string().min(8, "Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirm_password"],
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  interface CreateUserParams {
    values: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
      confirmPassword: string;
    };
    hashedPassword: string;
  }

  const createUser = async ({ values, hashedPassword }: CreateUserParams) => {
    try {
      const response = await axios.post(`${API_URL}/users/create`, {
        signal: newAbortSignal(),
        user: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        },
        credentials: {
          passwordHash: hashedPassword,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Failed to create user", error);
      const errorMessage =
        { 409: ACCOUNT_CREATE_USER_EXISTS_MESSAGE }[error?.response?.status] || ACCOUNT_CREATE_SERVER_ERROR_MESSAGE;
      form.setFocus("email");
      form.setError("email", { message: errorMessage });
      throw error;
    }
  };

  const handleEmailClick = async (values: z.infer<typeof FormSchema>) => {
    try {
      FormSchema.parse(values);
      setVerifyCode(generateOTP());

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(values.password, salt);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const data = await createUser({ values, hashedPassword });
      setUserId(data.user.userId);
      setStateDelayed(setFirstPhase(true), 200);
    } catch (error) {
      console.error("Email validation error", error);
    }
  };

  const fields: {
    name: "email" | "firstName" | "lastName" | "password" | "confirmPassword";
    label: string;
    placeholder: string;
    length: number;
  }[] = [
    { name: "email", label: "Email", placeholder: "alan.turing@example.com", length: 255 },
    { name: "firstName", label: "First Name", placeholder: "Riley", length: 32 },
    { name: "lastName", label: "Last Name", placeholder: "Thompson", length: 48 },
    { name: "password", label: "Password", placeholder: "••••••••", length: 255 },
    { name: "confirmPassword", label: "Confirm Password", placeholder: "••••••••", length: 255 },
  ];

  return (
    <Form {...form}>
      <form className="space-y-6">
        {fields.map((field) => (
          <FormItem key={field.name}>
            <FormLabel isRequired>{field.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={field.placeholder}
                type={field.name === "password" || field.name === "confirmPassword" ? "password" : "text"}
                maxLength={field.length}
                className="border rounded-lg"
                {...form.register(field.name)}
              />
            </FormControl>
            <FormMessage>{form.formState.errors[field.name]?.message}</FormMessage>
          </FormItem>
        ))}
        <Button className="w-full flex-row flex gap-1" type="submit" onClick={form.handleSubmit(handleEmailClick)}>
          Next
          <ArrowRight className="size-4" />
        </Button>
      </form>
    </Form>
  );
}
