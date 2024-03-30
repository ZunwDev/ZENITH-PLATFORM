import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const putUserToFirstPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    if (!queryParams.has("p")) {
      queryParams.set("p", "1");
      navigate(`${location.pathname}?${queryParams.toString()}`);
    }
  }, [location.search, history]);
};
