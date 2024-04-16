import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const usePageControls = (data?: any) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [currentPage, setCurrentPage] = useState("1");

  const handlePageChange = useCallback(
    (page, event) => {
      event.preventDefault();
      queryParams.set("p", page);
      setCurrentPage(page);
      navigate(`${location.pathname}?${queryParams.toString()}`);
    },
    [queryParams, navigate, location.pathname]
  );

  const calculateShowingRange = () => {
    const currentPage = data.number + 1;
    const pageSize = data.pageable.pageSize;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, data.totalElements);

    return (
      <span>
        <strong>{startItem}</strong>-<strong>{endItem}</strong>
      </span>
    );
  };

  const putUserToFirstPage = () => {
    if (!queryParams.has("p")) {
      queryParams.set("p", "1");
      navigate(`${location.pathname}?${queryParams.toString()}`);
    }
  };

  return { handlePageChange, calculateShowingRange, currentPage, putUserToFirstPage };
};
