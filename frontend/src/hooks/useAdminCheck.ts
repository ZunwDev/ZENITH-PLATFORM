import { fetchSessionData } from "@/lib/api";
import { BASE_URL } from "@/lib/constants";
import { goto } from "@/lib/utils";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const useAdminCheck = () => {
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
    if (isAdmin === false || isAdmin === null || isAdmin === undefined) {
      goto(BASE_URL);
    }
  }, [isAdmin]);

  return isAdmin;
};
