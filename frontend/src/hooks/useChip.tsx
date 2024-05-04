import { useCallback, useEffect, useState } from "react";

export const useChip = (initialState, setChecked, checked) => {
  const [newChecked, setNewChecked] = useState(checked);

  const handleChipRemove = useCallback((key, idToRemove) => {
    setNewChecked((prevChecked) => ({
      ...prevChecked,
      [key]: prevChecked[key].filter((id) => id !== idToRemove),
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setNewChecked(initialState);
  }, [initialState]);

  useEffect(() => {
    setNewChecked(checked);
  }, [checked]);

  useEffect(() => {
    setChecked(newChecked);
  }, [newChecked, setChecked]);

  // TODO: unified chip render function
  //! remove handleChipRemove from export after adding rendering
  return { handleChipRemove, handleResetFilters };
};
