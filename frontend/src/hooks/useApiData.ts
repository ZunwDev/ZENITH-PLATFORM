import { API_URL, newAbortSignal } from "@/lib/api";
import axios from "axios";
import { useEffect, useState } from "react";

export function useApiData(endpoint, queryParams, dependencies) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/${endpoint}${queryParams}`, {
          signal: newAbortSignal(),
        });
        setData(response.data);
        setError(null);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError(error);
          setData([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
}
