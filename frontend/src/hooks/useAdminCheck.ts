import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { goto } from "@/lib/utils";
import { BASE_URL } from "@/lib/constants";
import { fetchSessionData } from "@/lib/api";

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const sessionToken = Cookies.get("sessionToken");
      try {
        const data = await fetchSessionData(sessionToken);
        setIsAdmin(data.isAdmin);
      } catch (error) {
        goto(BASE_URL);
      }
    };

    fetchAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin === false) {
      goto(BASE_URL);
    }
  }, [isAdmin]);

  return isAdmin;
}
