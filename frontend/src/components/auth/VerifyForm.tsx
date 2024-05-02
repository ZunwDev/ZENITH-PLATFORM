import { useErrorToast, useSuccessToast } from "@/hooks";
import { API_URL, newAbortSignal } from "@/lib/api";
import axios from "axios";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { TextCursorInput } from "lucide-react";
import { useEffect, useState } from "react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";

interface VerifyFormProps {
  verifyCode: string;
  userId: number;
  setVerifyState: React.Dispatch<React.SetStateAction<boolean>>;
  verifyState: boolean;
}

export default function VerifyForm({ verifyCode, userId, setVerifyState, verifyState }: VerifyFormProps) {
  const [verifyCodeInput, setVerifyCodeInput] = useState("");
  const showErrorToast = useErrorToast();
  const showSuccessToast = useSuccessToast();

  async function handleVerifyClick() {
    try {
      if (verifyCodeInput === verifyCode) {
        await axios.put(`${API_URL}/users/verify/${userId}`, { signal: newAbortSignal() });
        setVerifyState(true);
        showSuccessToast("Verification", "Verification was successful, redirecting in 3 seconds...");
        //goto("/auth/signin", 3000);
      } else {
        showErrorToast("Verification", "Invalid verification code. Please try again.");
        setVerifyCodeInput("");
      }
    } catch (error) {
      setVerifyCodeInput("");
      showErrorToast("Verification", "Failed to verify user. Please try again.");
    }
  }

  useEffect(() => {
    if (verifyCodeInput.length === 6) {
      handleVerifyClick();
    }
  }, [verifyCodeInput]);

  return (
    <>
      <div className="flex flex-col gap-2 items-center">
        <TextCursorInput className="size-32 stroke-1" />
        <div className="space-y-2">
          <p className="font-semibold">Enter OTP here</p>
          <InputOTP
            maxLength={6}
            value={verifyCodeInput}
            onChange={(value) => {
              setVerifyCodeInput(value);
            }}
            pattern={REGEXP_ONLY_DIGITS}
            disabled={verifyState}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>
    </>
  );
}
