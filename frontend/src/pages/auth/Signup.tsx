import { MainInformationForm, VerifyForm } from "@/components/auth";
import { Logo } from "@/components/global";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InformationDescription } from "@/components/util";
import { STORE_NAME } from "@/lib/constants";
import { goto } from "@/lib/utils";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [firstPhase, setFirstPhase] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [userId, setUserId] = useState(0);
  const [verifyState, setVerifyState] = useState(false);

  useEffect(() => {
    if (Cookies.get("sessionToken") !== undefined) {
      goto("/");
    }
  }, []);

  // Main information
  if (!firstPhase) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 h-screen mb-8">
        <div className="flex flex-row gap-4 items-center">
          <Logo fillColor="black" className="md:size-20 size-12" />
          <p className="md:text-4xl sm:text-lg sm:block hidden tracking-widest font-semibold select-none font-brunoac">
            {STORE_NAME}
          </p>
        </div>
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="mb-2">Create Your Account</CardTitle>
            <CardDescription className="font-semibold">Shopped with us before?</CardDescription>
            <CardDescription>Use the information you provided in store.</CardDescription>
          </CardHeader>
          <CardContent>
            <MainInformationForm setFirstPhase={setFirstPhase} setVerifyCode={setVerifyCode} setUserId={setUserId} />
            <CardFooter className="flex flex-col">
              <Link className="w-full justify-center flex mt-2 text-primary hover:underline text-sm" to={"/auth/signin"}>
                Sign in another way
              </Link>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verify code, that was meant to be sent to email
  return (
    <div className="flex flex-col items-center justify-center gap-8 h-screen mb-8">
      <div className="flex flex-row gap-4 items-center">
        <Logo fillColor="black" className="md:size-24 size-12" />
        <p className="md:text-4xl sm:text-lg sm:block hidden tracking-widest font-semibold select-none font-brunoac">
          {STORE_NAME}
        </p>
      </div>
      <Card className="w-[360px]">
        <CardHeader>
          <CardTitle>User Verification</CardTitle>
          <CardDescription>
            A verification code has been sent to your email. Please enter your code below. <br />
            <InformationDescription>
              Your code: <strong>{verifyCode}</strong>
            </InformationDescription>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyForm verifyCode={verifyCode} userId={userId} setVerifyState={setVerifyState} verifyState={verifyState} />
        </CardContent>
      </Card>
    </div>
  );
}
