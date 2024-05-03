import { useCallback, useEffect, useState } from "react";

export const useChip = (initialState, setChecked) => {
  const [newChecked, setNewChecked] = useState(initialState);

  const handleChipRemove = useCallback((key, idToRemove) => {
    setNewChecked((prevChecked) => {
      const updatedChecked = { ...prevChecked };
      updatedChecked[key] = updatedChecked[key].filter((id) => id !== idToRemove);
      return updatedChecked;
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setNewChecked(initialState);
  }, [initialState]); // Make sure to include initialState in dependencies

  useEffect(() => {
    setChecked(newChecked);
  }, [newChecked]);
  //TODO: unified chip render function

  //! remove handleChipRemove from export after adding rendering
  return { handleChipRemove, handleResetFilters };
};
