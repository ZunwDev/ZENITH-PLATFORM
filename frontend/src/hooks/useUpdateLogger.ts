import { useEffect } from "react";

export const useUpdateLogger = (state, name: string) => {
  useEffect(() => {
    console.log(`${name} updated:`, state);
  }, [state, name]);
};
