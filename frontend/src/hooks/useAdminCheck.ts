import { fetchSessionData } from "@/lib/api";
import { BASE_URL } from "@/lib/constants";
import { goto } from "@/lib/utils";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const useAdminCheck = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const sessionToken = Cookies.get("sessionToken");
      try {
        const data = await fetchSessionData(sessionToken);
        setData(data);
      } catch (error) {
        goto(BASE_URL);
      }
    };

    fetchAdminStatus();
  }, []);

  useEffect(() => {
    if (data && !data.isAdmin) {
      goto(BASE_URL);
    }
  }, [data]);
};
