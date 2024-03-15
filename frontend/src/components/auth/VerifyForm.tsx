import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, goto, newAbortSignal } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { API_URL } from "@/lib/api";

interface VerifyFormProps {
  verifyCode: string;
  userId: number;
  setVerifyState: React.Dispatch<React.SetStateAction<boolean>>;
  verifyState: boolean;
}

export default function VerifyForm({ verifyCode, userId, setVerifyState, verifyState }: VerifyFormProps) {
  const [buttonText, setButtonText] = useState("VERIFY");
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
    try {
      VerifyCodeSchema.parse(values);
      await axios.put(`${API_URL}/users/verify/${userId}`, { signal: newAbortSignal() });
      setVerifyState(true);
      setButtonText("REDIRECTING...");
      goto("/auth/signin", 1000);
    } catch (error) {
      throw new Error("Failed to verify a user");
    }
  }

  return (
    <>
      <h1 className="text-2xl mt-6 mb-6 font-semibold">
        "A verification link has been sent to your email." (code: {verifyCode}).
      </h1>
      <Form {...verifyForm}>
        <form className="space-y-6">
          <FormItem>
            <FormLabel htmlFor="verify" isRequired>
              Verify Code
            </FormLabel>
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
            {buttonText}
          </Button>
        </form>
      </Form>
    </>
  );
}
