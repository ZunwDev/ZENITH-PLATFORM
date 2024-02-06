import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface VerifyFormProps {
  verifyCode: string;
  userId: number;
  setVerifyState: (value: boolean) => void;
  verifyState: boolean;
}

export default function VerifyForm({ verifyCode, userId, setVerifyState, verifyState }: VerifyFormProps) {
  const VerifyCodeSchema = z
    .object({
      verify_code: z.string().min(6, "Your code must be 6 characters long"),
    })
    .refine((data) => data.verify_code === verifyCode, {
      message: "Wrong code, try again",
      path: ["verify_code"],
    });

  const verifyForm = useForm<z.infer<typeof VerifyCodeSchema>>({
    mode: "onChange",
    resolver: zodResolver(VerifyCodeSchema),
    defaultValues: {
      verify_code: "",
    },
  });

  async function handleVerifyClick(values: z.infer<typeof VerifyCodeSchema>) {
    VerifyCodeSchema.parse(values);
    const response = await fetch(`${API_URL}/users/verify/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to verify a user");
    }

    setVerifyState(true);
  }

  return (
    <>
      <h1 className="text-2xl mt-6 mb-6 font-semibold">
        "A verification link has been sent to your email." (code: {verifyCode}).
      </h1>
      <h4 className="italic mb-4">
        Since I can't find any free solution to send emails to anyone, this is only thing I can do.
      </h4>
      <Form {...verifyForm}>
        <form className="space-y-6">
          <FormItem>
            <FormLabel>Verify Code</FormLabel>
            <FormControl>
              <Input placeholder="Enter 6-digit code" maxLength={6} {...verifyForm.register("verify_code")} />
            </FormControl>
            <FormMessage>{verifyForm.formState.errors.verify_code?.message}</FormMessage>
          </FormItem>

          <Button
            className={cn("w-full flex flex-row gap-1")}
            type="submit"
            onClick={verifyForm.handleSubmit(handleVerifyClick)}
            disabled={verifyState}>
            {verifyState && <CheckCircle />}
            VERIFY
          </Button>
        </form>
      </Form>
    </>
  );
}
