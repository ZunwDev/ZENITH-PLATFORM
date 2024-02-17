import { BASE_URL } from "@/lib/constants";
import { goto } from "@/lib/utils";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Products } from "../components/dashboard";
import { useParams } from "react-router-dom";
import { fetchSessionData } from "@/lib/api";

const sessionToken = Cookies.get("sessionToken");

export default function Dashboard() {
  const { path } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchSessionData(sessionToken);
        if (!data.isAdmin) {
          goto(BASE_URL);
        }
      } catch (error) {
        goto(BASE_URL);
      }
    })();
  }, []);

  return (
    <section className="mt-32 flex flex-col gap-12 px-8 md:min-w-[1600px] min-w-[360px] max-w-[1600px]">
      {path === "products" && <Products />}
    </section>
  );
}
