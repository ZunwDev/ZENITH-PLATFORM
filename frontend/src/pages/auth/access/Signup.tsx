import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import MainInformationForm from "@/components/auth/MainInformationForm";
import VerifyForm from "@/components/auth/VerifyForm";
import Cookies from "js-cookie";

function Signup() {
  const [firstPhase, setFirstPhase] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [userId, setUserId] = useState(0);
  const [verifyState, setVerifyState] = useState(false);

  useEffect(() => {
    if (Cookies.get("firstName") !== undefined) {
      window.location.href = "/";
    }
  }, []);

  // Main information
  if (!firstPhase) {
    return (
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
    );
  }

  // Verify code, that was meant to be sent to email
  return (
    <Card className="w-[450px]">
      <CardContent>
        <VerifyForm verifyCode={verifyCode} userId={userId} setVerifyState={setVerifyState} verifyState={verifyState} />
        {verifyState && (
          <CardFooter className="flex flex-col">
            <Link className="w-full justify-center flex mt-2 text-primary hover:underline text-sm" to={"/auth/signin"}>
              Sign in another way
            </Link>
          </CardFooter>
        )}
      </CardContent>
    </Card>
  );
}

export default Signup;
