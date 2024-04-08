import { useEffect, useState } from "react";
import { useTimeout } from ".";

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const { reset, clear } = useTimeout(() => {
    setDebouncedValue(value);
  }, delay);

  useEffect(() => {
    reset();
  }, [value, reset]);

  useEffect(() => {
    return () => {
      clear();
    };
  }, [clear]);

  return debouncedValue;
};
