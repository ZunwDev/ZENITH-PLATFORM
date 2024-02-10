import { BASE_URL } from "@/lib/constants";
import { goto } from "@/lib/utils";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Products } from ".";
import { useParams } from "react-router-dom";

const roleId = Cookies.get("roleId");

export default function Dashboard() {
  const { path } = useParams();

  useEffect(() => {
    if (roleId === "1" || roleId === undefined) {
      goto(BASE_URL);
    }
  }, []);
  return (
    <div className="mt-32 flex flex-col gap-12 px-8 text-accent-foreground md:min-w-[1600px] min-w-[360px] min-h-[100dvh] max-w-[1600px]">
      {path === "products" && <Products />}
    </div>
  );
}
