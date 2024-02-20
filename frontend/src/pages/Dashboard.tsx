import { BASE_URL } from "@/lib/constants";
import { goto } from "@/lib/utils";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Products } from "../components/dashboard";
import { useParams } from "react-router-dom";
import { fetchSessionData } from "@/lib/api";
import NewProductForm from "@/components/dashboard/forms/NewProductForm";

export default function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(null);
  const { path, isNew } = useParams();

  useEffect(() => {
    (async () => {
      const sessionToken = Cookies.get("sessionToken");
      try {
        const data = await fetchSessionData(sessionToken);
        setIsAdmin(data.isAdmin);
      } catch (error) {
        goto(BASE_URL);
      }
    })();
  }, []);

  if (isAdmin === null) {
    return null;
  }

  if (!isAdmin) {
    goto(BASE_URL);
    return null;
  }

  return (
    <section className="mt-32 flex flex-col gap-12 px-8 md:min-w-[1600px] min-w-[360px] max-w-[1600px]">
      {path === "products" ? isNew === "new" ? <NewProductForm /> : <Products /> : null}
    </section>
  );
}
