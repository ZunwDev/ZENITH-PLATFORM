import { BASE_URL } from "@/lib/constants";
import Cookies from "js-cookie";
import { useEffect } from "react";

const roleId = Cookies.get("roleId");

export default function Dashboard() {
  useEffect(() => {
    if (roleId === "1") {
      window.location.href = BASE_URL;
    }
  }, []);
  return <div></div>;
}
