import { fetchSessionData } from "@/lib/api";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export function useGetSessionData() {
  const sessionToken = Cookies.get("sessionToken");
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (sessionToken) {
          const data = await fetchSessionData(sessionToken);
          setSessionData({ sessionToken, ...data }); // Include sessionToken in the output data
        }
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchData();
  }, []);

  return sessionData;
}
