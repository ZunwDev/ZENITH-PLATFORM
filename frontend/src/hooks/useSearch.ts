import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useSearch = (setSearchQueryCallback) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const handleSearch = (query: string, event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSearchQueryCallback(query); // Update searchQuery in Products
    query === "" ? queryParams.delete("q") : queryParams.set("q", query);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  const getSearchQueryFromURL = () => {
    return queryParams.get("q");
  };

  return { handleSearch, getSearchQueryFromURL };
};
