import { useLocation, useNavigate } from "react-router-dom";

export const useUpdateQueryParams = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (params) => {
    const queryParams = new URLSearchParams(params);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };
};
