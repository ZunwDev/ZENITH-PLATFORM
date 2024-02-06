import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { formatDate, generateOTP } from "@/lib/utils";
import { API_URL } from "@/lib/constants";

interface MainInfoFormProps {
  setFirstPhase: (value: boolean) => void;
  setVerifyCode: (value: string) => void;
  setUserId: (value: number) => void;
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
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    };
    formattedDate: string;
    hashedPassword: string;
  }

  const createUser = async ({ values, formattedDate, hashedPassword }: CreateUserParams) => {
    try {
      const response = await fetch(`${API_URL}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            userRoleId: 1,
            createdAt: formattedDate,
            verified: false,
          },
          credentials: {
            passwordHash: hashedPassword,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errorCode === 409) {
          form.setFocus("email");
          form.setError("email", { message: "User with this email already exists" });
        }
        throw new Error("Failed to create user");
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: (error as Error).message };
    }
  };

  const handleEmailClick = async (values: z.infer<typeof FormSchema>) => {
    try {
      FormSchema.parse(values);
      const verifyCode = generateOTP();
      setVerifyCode(verifyCode);

      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(values.password, salt);

      const { data, error } = await createUser({
        values,
        formattedDate,
        hashedPassword,
      });

      if (error) {
        throw new Error((error as unknown as Error).message);
      }

      setUserId(data.user.userId);

      setTimeout(() => {
        setFirstPhase(true);
      }, 200);
    } catch (error) {
      console.error("Email validation error", error);
    }
  };

  const fields: {
    name: "email" | "firstName" | "lastName" | "password" | "confirmPassword";
    label: string;
    isPassword?: boolean;
    placeholder: string;
    length: number;
    errorMsg: string | undefined;
  }[] = [
    {
      name: "email",
      label: "Email",
      placeholder: "alan.turing@example.com",
      length: 255,
      errorMsg: form.formState.errors.email?.message,
    },
    {
      name: "firstName",
      label: "First Name",
      placeholder: "Riley",
      length: 32,
      errorMsg: form.formState.errors.firstName?.message,
    },
    {
      name: "lastName",
      label: "Last Name",
      placeholder: "Thompson",
      length: 48,
      errorMsg: form.formState.errors.lastName?.message,
    },
    {
      name: "password",
      label: "Password",
      isPassword: true,
      placeholder: "••••••••",
      length: 255,
      errorMsg: form.formState.errors.password?.message,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      isPassword: true,
      placeholder: "••••••••",
      length: 255,
      errorMsg: form.formState.errors.confirmPassword?.message,
    },
  ];

  return (
    <Form {...form}>
      <form className="space-y-6">
        {fields.map((element) => (
          <FormItem key={element.name}>
            <FormLabel>{element.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={element.placeholder}
                type={element.isPassword ? "password" : "text"}
                maxLength={element.length}
                {...form.register(element.name)}
              />
            </FormControl>
            <FormMessage>{element.errorMsg}</FormMessage>
          </FormItem>
        ))}
        <Button className="w-full" type="submit" onClick={form.handleSubmit(handleEmailClick)}>
          CREATE ACCOUNT & CONTINUE
        </Button>
      </form>
    </Form>
  );
}
