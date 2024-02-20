import { Button } from "@/components/ui/button";
import { fetchSessionData } from "@/lib/api";
import { SessionData } from "@/lib/interfaces";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const sessionToken = Cookies.get("sessionToken");

export default function NewProductButton() {
  const [data, setData] = useState<SessionData>({ roleId: "", userId: "", firstName: "", isAdmin: false });

  useEffect(() => {
    (async () => {
      try {
        setData(await fetchSessionData(sessionToken));
      } catch (error) {
        return;
      }
    })();
  }, []);
  return (
    <Button className="sm:flex flex-row gap-2 items-center justify-center hidden" asChild>
      <a
        href={`/${data.userId}/dashboard/products/new`}
        onClick={(e) => {
          e.preventDefault();
          window.location.replace(`/${data.userId}/dashboard/products/new`);
        }}>
        <span className="text-2xl">+</span>New Product
      </a>
    </Button>
  );
}
